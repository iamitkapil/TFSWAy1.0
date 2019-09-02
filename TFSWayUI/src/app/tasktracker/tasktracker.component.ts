import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Location } from '@angular/common';
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { Projectservice } from '../service/project.service';
import { NgProgress } from 'ngx-progressbar';
import { UserService } from '../service/user.service'
import { IUser } from '../loginform/user';
import { ITaskTracker } from '../taskTracker/taskTracker';
import { TaskTrackerService } from '../service/taskTracker.service';
import { IMyDpOptions, IMyDateModel, IMyInputFieldChanged } from 'mydatepicker';
import { IProjectPlan } from '../projectplan/projectplan';
import { IProjectActivityPlan } from '../projectplan/projectactivityplan';
import { Iactivity } from '../projectplan/activity';
import { ProjectPlanService } from '../service/projectplan.service';
import { ActivityService } from '../service/activity.service';
import 'rxjs/add/operator/switchMap';
import { PagerService } from '../service/pager.service';
let saveAs = require('file-saver');
import { IMOM } from '../meeting/mom';
import { MOMService } from '../service/mom.service';


@Component({
    selector: 'app-tasktracker',
    templateUrl: 'app/tasktracker/tasktracker.component.html',
    styleUrls: ['app/tasktracker/tasktracker.component.css'],
    providers: [TaskTrackerService, Projectservice, ProjectPlanService, ActivityService, MOMService]

})


export class TaskTrackerComponent {

    public static ctlEndDate: Date;
    tasktrackerForm: FormGroup;
    FormprojectId: number = 0;
    projectID: number = 0;
    formcreateddate: Date = new Date();
    createdDate: any;
    createdBy: string = "";
    formcreatedby: string = "";
    formdocumentPath: string = "";
    taskTrackerID: number = 0;
    errorMessage: any;
    submitted: boolean = false;
    _ref: any;
    title: string = "Add";

    projectId: number;
    moms: Array<IMOM> = [];
    projectplans: Array<IProjectActivityPlan> = [];
    currentId: number = 0;
    serarchText: string = '';

    selectedProject: number;
    pager: any = {};
    itemsperpage: number = 10
    order: string = 'srNo';
    reverse: boolean = false;
    groupName: string;
    companyName: string;
    projectName: string;

    ProjectStartDate: Date;
    ProjectEndDate: Date;
    projectplanid: number = 0;
    dependencyvalue: number = 0;
    isSubmitted: boolean = false;
    isApproved: boolean = false;
    isCreated: boolean = false;
    isOtherActivity: boolean = false;
    IsMOM: boolean = false;
    IsEdit: boolean = false;
    ButtonText: string = "Submit";
    projectActPlnID: number = 0;
    MOMID: number = 0;
    public stages: Array<Iactivity>;
    public activityList: Array<Iactivity>;
    public AddMorePlan: boolean = false;
    private activeuserdesignation: string;
    public isAdmin: boolean = false;
    isTaskExist: boolean = false;
    public model: any;
    public myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd-mm-yyyy',
        height: '23px',
        showInputField: true,
        width: '160px'
    };

    objmom = <IMOM>{ momId: null, projectId: null, momType: '', meetingDate: null, minutes: '', taskComplitionDate: null, status: '', createdDate: this.createdDate, createdBy: this.createdBy };

    constructor(private _mom: MOMService, private _location: Location, private http: Http, private _fb: FormBuilder,
        private _avRoute: ActivatedRoute,
        private _projectservice: Projectservice,
        private _activityService: ActivityService,
        private _projectplanservice: ProjectPlanService,
        private _taskTrackerservice: TaskTrackerService,
        private _router: Router,
        public ngProgress: NgProgress, private _user: UserService) {
        this.FormprojectId = _user.ActiveProjectId;
        this.formcreatedby = _user.userName;
        this.activeuserdesignation = _user.Designation;
        this.ProjectStartDate = new Date(_user.ProjectStartDate);
        this.ProjectEndDate = new Date(_user.ProjectEndDate);
        this.groupName = _user.GroupName;
        this.companyName = _user.CompanyName;
        this.projectName = _user.ProjectName;

        this.tasktrackerForm = this._fb.group({
            projectActivityPlanID: 0,
            projectID: this.FormprojectId,
            projectPlanID: this.projectplanid,
            parentID: ['', [Validators.required]],
            activity: (''),
            task: (''),
            endDate: ['select date', [Validators.required]],
            status: (''),
            complitionDate: (''),
            //complitionDate: ['select date', [Validators.required, this.endDateCompareValidation]],
            createdDate: this.formcreateddate.toUTCString(),
            createdBy: this.formcreatedby
        })


    }

    endDateCompareValidation(input: FormControl) {

        if (!input.value) {
            return null;
        }

        var CompletionDate;
        var Todaydate = new Date();

        if (input.value.jsdate == null)
            CompletionDate = new Date(input.value);
        else
            CompletionDate = input.value.jsdate;

        if (TaskTrackerComponent.ctlEndDate != null) {


            if (input.value != "select date") {
                return (CompletionDate >= Todaydate) ? null : { endDatesCompareIssue: true };
            }
            else {
                return null;
            }
        }
        else
            return null;
    }

    ngOnInit() {
        this.getprojectactivityplans();
        this.getStages();
        this.getmoms();
    }

    getmoms() {
        this.ngProgress.start();
        this._mom.getMOMTasks(this.FormprojectId).subscribe((data) => {
            this.moms = data;
            let max: number = 0;
            let maxdocument = data.map(function (moms: IMOM) { if (moms.momId > max) { max = moms.momId } });
            this.ngProgress.done();
        }
            , error => { this.errorMessage = error })
    }

    getStages() {
        this._projectplanservice.getStagesbyID(this.FormprojectId).subscribe((stages) => {
            this.stages = stages;
        }
            , error => { this.errorMessage = error })
    }

    getActivities(projectid: number, templateid: number) {
        this._projectplanservice.getActivitiesbyID(projectid, templateid).subscribe((act) => {
            this.activityList = act;
        }
            , error => { this.errorMessage = error })
    }

    onTaskChange(templateid: any) {

        var tasksource = templateid.options[templateid.selectedIndex].value;
        if (tasksource == "MOM")
            this.IsMOM = true;
        else
            this.IsMOM = false;

    }

    onStageChange(templateid: any) {

        var stageName = templateid.options[templateid.selectedIndex].text;
        var intstageID = templateid.options[templateid.selectedIndex].value;
        this.getActivities(this.FormprojectId, intstageID);
    }

    delay(enddate: Date): string {


        var date1 = new Date(enddate);
        var date2 = new Date();
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (enddate == null)
            return '';
        else
            return diffDays.toString() + ' Days';
    }
    getprojectactivityplans() {
        this.ngProgress.start();
        this._projectplanservice.GetProjectActivityPlansbyID(this.FormprojectId).subscribe((data) => {
            if (data.length != 0) {
                this.projectplans = data;
                console.log(this.projectplans);
                this.projectplanid = data[0].projectPlanID;
                let max: number = 0;
                let maxdocument = data.map(function (projectactivityplan: IProjectActivityPlan) { if (projectactivityplan.projectActivityPlanID > max) { max = projectactivityplan.projectActivityPlanID } });
            }
            this.ngProgress.done();
        }
            , error => { this.errorMessage = error })
    }

    add() {
        this.IsEdit = false;
        this.AddMorePlan = true;
    }

    edit(objprojectplan: IProjectActivityPlan) {

        this.IsEdit = true;
        this.AddMorePlan = true;
        this.projectActPlnID = objprojectplan.projectActivityPlanID;
        this.tasktrackerForm.patchValue({ projectActivityPlanID: objprojectplan.projectActivityPlanID });
        this.tasktrackerForm.patchValue({ projectID: objprojectplan.projectID });
        this.tasktrackerForm.patchValue({ projectPlanID: objprojectplan.projectPlanID });
        this.tasktrackerForm.controls["parentID"].setValue(objprojectplan.parentID);
        this.tasktrackerForm.controls["activity"].setValue(objprojectplan.activity);
        this.tasktrackerForm.controls["task"].setValue(objprojectplan.task);
        this.tasktrackerForm.controls["endDate"].setValue(objprojectplan.endDate);
        TaskTrackerComponent.ctlEndDate = objprojectplan.endDate;
        this.tasktrackerForm.patchValue({ createdDate: this.formcreateddate.toUTCString() });
        this.tasktrackerForm.patchValue({ createdBy: this.formcreatedby });
        this.setCompletionDate();
    }

    editMOM(objMOM: IMOM) {

        this.IsEdit = true;
        this.AddMorePlan = true;
        this.MOMID = objMOM.momId;
        this.objmom.momId = objMOM.momId;
        this.objmom.projectId = objMOM.projectId;
        this.objmom.momType = objMOM.momType;
        this.objmom.meetingDate = objMOM.meetingDate;
        this.objmom.minutes = objMOM.minutes;
        this.objmom.taskComplitionDate = objMOM.taskComplitionDate;
        this.objmom.status = objMOM.status;
        this.objmom.createdDate = this.formcreateddate;
        this.objmom.createdBy = this.formcreatedby;
        this.tasktrackerForm.controls['endDate'].setValue("");
        this.tasktrackerForm.controls['endDate'].setErrors(null);
        this.setCompletionDate();
    }

    cancel() {
        this._location.back();
    }

    setDate(): void {
        let date = new Date();
        this.tasktrackerForm.patchValue({
            endDate: {
                date: {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    day: date.getDate()
                }
            }
        });
    }
    setCompletionDate(): void {
        let date = new Date();
        this.tasktrackerForm.patchValue({
            complitionDate: {
                date: {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    day: date.getDate()
                }
            }
        });
    }
    clearDate(): void {
        this.tasktrackerForm.patchValue({ endDate: null, starDate: null });
    }

    onDateChanged(event: IMyDateModel) {

    }

    onEndDateChanged(event: IMyDateModel) {

    }

    ExportToExcel() {

        var ExportGrid = document.getElementById('exportgrid').innerHTML;
        ExportGrid = ExportGrid.replace("Action", "");
        let blob = new Blob([ExportGrid], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
        });
        saveAs(blob, "Activities_TaskList_" + this.FormprojectId + ".xls");

    }

    save() {

        if (this.MOMID > 0) {
            let complitionDatetring = "";

            this.objmom.status = "Completed";

            if (this.complitionDate.value != "select date") {
                if (this.complitionDate.value.date != null)
                    complitionDatetring = this.complitionDate.value.date.year + '-' + this.complitionDate.value.date.month + '-' + this.complitionDate.value.date.day;
                else
                    complitionDatetring = this.complitionDate.value;
                this.complitionDate.setValue(complitionDatetring);
            }
            else
                this.complitionDate.setValue(this.complitionDate.value.formatted);
            if (this.complitionDate.value.formatted != null)
                this.objmom.taskComplitionDate = this.complitionDate.value.formatted;
            else
                this.objmom.taskComplitionDate = this.complitionDate.value;

            this.ngProgress.start();
            this._mom.saveMOM(this.objmom);

            setTimeout(() => {
                this.ngProgress.done();
                this.getmoms();
                this.clearEdit();
            }, 1000);

            this.AddMorePlan = false;
            TaskTrackerComponent.ctlEndDate = null;
        }
        else {

            let complitionDatetring = "";
            if (this.projectActPlnID > 0) {
                //this.complitionDate.setValue(this.complitionDate.value.formatted);
                this.status.setValue("Completed");

                if (this.complitionDate.value != "select date") {
                    if (this.complitionDate.value.date != null)
                        complitionDatetring = this.complitionDate.value.date.year + '-' + this.complitionDate.value.date.month + '-' + this.complitionDate.value.date.day;
                    else
                        complitionDatetring = this.complitionDate.value;
                    this.complitionDate.setValue(complitionDatetring);
                }
                else
                    this.complitionDate.setValue(this.complitionDate.value.formatted);

                if (!this.tasktrackerForm.valid) {
                    this.submitted = true;
                    return;
                }

                this.ngProgress.start();
                this._projectplanservice.saveProjectTaskPlan(this.tasktrackerForm.value)
                    .subscribe(resp => {
                        this.projectplanid = resp;

                    }
                    );

                setTimeout(() => {
                    this.ngProgress.done();
                    this.getprojectactivityplans();
                    this.clearEdit();
                }, 1000);

                this.AddMorePlan = false;
            }
            else {

                if (this.projectplanid > 0)
                    this.projectPlanID.setValue(this.projectplanid);

                if (this.taskTrackerID > 0) {
                    let startdatestring = "";
                    startdatestring = this.endDate.value.date.year + '-' + this.endDate.value.date.month + '-' + this.endDate.value.date.day;
                    this.endDate.setValue(startdatestring);
                }
                else {
                    this.endDate.setValue(this.endDate.value.formatted);
                }

                if (!this.tasktrackerForm.valid) {
                    this.submitted = true;
                    return;
                }
                this._projectplanservice.isTaskExist(this.projectPlanID.value, this.task.value)
                    .subscribe(resp => {
                        this.isTaskExist = resp;
                    }
                    );

                this.ngProgress.start();
                this._projectplanservice.saveProjectTaskPlan(this.tasktrackerForm.value)
                    .subscribe(resp => {
                        this.projectplanid = resp;
                    }
                    );

                setTimeout(() => {
                    this.ngProgress.done();
                    this.getprojectactivityplans();
                    if (this.isTaskExist == true)
                        alert('This Task is already Exist');
                    this.clear();
                }, 1000);
            }
        }
    }

    clear() {
        this.isOtherActivity = false;
        this.tasktrackerForm.controls['parentID'].setValue("");
        this.tasktrackerForm.controls['parentID'].setErrors(null);
        this.tasktrackerForm.controls['activity'].setValue("");
        this.tasktrackerForm.controls['task'].setValue("");
        this.tasktrackerForm.controls['endDate'].setValue("");
        this.tasktrackerForm.controls['endDate'].setErrors(null);
    }

    clearEdit() {
        this.tasktrackerForm.controls['complitionDate'].setValue("");
        this.tasktrackerForm.controls['complitionDate'].setErrors(null);
        this.tasktrackerForm.controls['status'].setValue("");
        this.tasktrackerForm.controls['status'].setErrors(null);
    }

    get parentID() { return this.tasktrackerForm.get('parentID'); }
    get activity() { return this.tasktrackerForm.get('activity'); }
    get task() { return this.tasktrackerForm.get('task'); }
    //get responsible() { return this.tasktrackerForm.get('responsible'); }
    get endDate() { return this.tasktrackerForm.get('endDate'); }
    get status() { return this.tasktrackerForm.get('status'); }
    get complitionDate() { return this.tasktrackerForm.get('complitionDate'); }
    get projectPlanID() { return this.tasktrackerForm.get('projectPlanID'); }

}  