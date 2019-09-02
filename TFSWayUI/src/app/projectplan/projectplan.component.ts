import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { Projectservice } from '../service/project.service';
import { NgProgress } from 'ngx-progressbar';
import { UserService } from '../service/user.service'
import { IUser } from '../loginform/user';
import { IProjectPlan } from '../projectplan/projectplan';
import { IProjectActivityPlan } from '../projectplan/projectactivityplan';
import { Iactivity } from '../projectplan/activity';
import { ProjectPlanService } from '../service/projectplan.service';
import { ActivityService } from '../service/activity.service';
import { IMyDpOptions, IMyDateModel, IMyInputFieldChanged } from 'mydatepicker';
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { PagerService } from '../service/pager.service';
let saveAs = require('file-saver')


@Component({
    selector: 'app-projectactivityplan',
    templateUrl: 'app/projectplan/projectplan.component.html',
    styleUrls: ['app/projectplan/projectplan.component.css'],
    providers: [ProjectPlanService, Projectservice, ActivityService]

})


export class ProjectPlanComponent {


    public static ProjectStartDate: Date;
    public static ProjectEndDate: Date;
    public static ctlStartDate: Date;
    public static ctlEndDate: Date;
    public static ctlDepStartDate: Date;
    public static ctlDepEndDate: Date;
    projectId: number;
    projectplans: Array<IProjectPlan> = [];
    errorMessage: any;
    currentId: number = 0;
    serarchText: string = '';

    selectedProject: number;
    pager: any = {};
    itemsperpage: number = 10
    order: string = 'srNo';
    reverse: boolean = false;
    projectplanForm: FormGroup;
    FormprojectId: number = 0;
    projectID: number = 0;
    ProjectStartDate: Date;
    ProjectEndDate: Date;
    formcreateddate: Date = new Date();
    createdDate: any;
    createdBy: string = "";
    formcreatedby: string = "";
    formdocumentPath: string = "";
    projectplanid: number = 0;
    dependencyvalue: number = 0;
    submitted: boolean = false;
    isSubmitted: boolean = false;
    isApproved: boolean = false;
    isCreated: boolean = false;
    isOtherActivity: boolean = false;
    isActivityExist: boolean = false;
    _ref: any;
    title: string = "Add";
    ButtonText: string = "Submit";
    public stages: Array<Iactivity>;
    public activityList: Array<Iactivity>;
    public AddMorePlan: boolean = false;
    private activeuserdesignation: string;
    public isAdmin: boolean = false;
    groupName: string;
    companyName: string;
    projectName: string;

    public myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd-mm-yyyy',
        height: '23px',
        showInputField: true,
        width: '160px'
    };

    objProjectplan = <IProjectPlan>{ ProjectPlanID: null, ProjectID: null, ProjectPlanStatus: '', ReopenReason: '', CreatedDate: this.createdDate, CreatedBy: this.createdBy };

    constructor(private _location: Location, private http: Http, private _fb: FormBuilder,
        private _avRoute: ActivatedRoute,
        private _projectservice: Projectservice,
        private _activityService: ActivityService,
        private _projectplanservice: ProjectPlanService,
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
        ProjectPlanComponent.ProjectStartDate = new Date(_user.ProjectStartDate);
        ProjectPlanComponent.ProjectEndDate = new Date(_user.ProjectEndDate);

        if (this.activeuserdesignation == 'Admin') {
            this.isAdmin = true;
            this.ButtonText = "Approve";
        }
        else {
            this.isAdmin = false;
            this.ButtonText = "Submit";
        }
        if (this._avRoute.snapshot.params["id"]) {
            this.projectplanid = parseInt(this._avRoute.snapshot.params["id"]);
            this.AddMorePlan = false;
            _user.ProjectPlanID = this.projectplanid;
        }
        else {
            this.AddMorePlan = true;
            this.isCreated = true;
        }
        if (this._avRoute.snapshot.params["status"]) {
            if (this._avRoute.snapshot.params["status"] == "Approved") {
                this.isApproved = true;
                this.isCreated = false;
            }
            if (this._avRoute.snapshot.params["status"] == "Created")
                this.isCreated = true;

            if (this._avRoute.snapshot.params["status"] == "ReOpened" || this._avRoute.snapshot.params["status"] == "Rejected")
                this.isCreated = true;

            if (this._avRoute.snapshot.params["status"] == "Submitted") {
                this.isSubmitted = true;
                this.isCreated = false;
            }
        }

        this.projectplanForm = this._fb.group({
            projectActivityPlanID: 0,
            projectPlanID: this.projectplanid,
            projectID: this.FormprojectId,
            parentID: ['', [Validators.required]],
            activity: (''),
            otherActivity: (''),
            dependency: (''),
            startDate: ['select start date', [Validators.required, this.startDateValidation/*, this.startDateCompareValidation*/, this.startDepDateValidation]],
            endDate: ['select end date', [Validators.required, this.endDateValidation, this.endDateCompareValidation, this.endDepDateValidation]],
            createdDate: this.formcreateddate.toUTCString(),
            createdBy: this.formcreatedby,
            reason: ('')
        })


    }

    startDateValidation(input: FormControl) {

        if (!input.value) {
            return null;
        }

        var Startdate;

        if (input.value.jsdate == null)
            Startdate = new Date(input.value);
        else
            Startdate = input.value.jsdate;

        if (Startdate >= ProjectPlanComponent.ProjectStartDate) {
            return null;
        }
        else {
            return {
                startDateIssue: {
                    valid: true
                }

            };
        }
    }

    startDepDateValidation(input: FormControl) {

        if (!input.value) {
            return null;
        }

        var Startdate;

        if (input.value.jsdate == null)
            Startdate = new Date(input.value);
        else
            Startdate = input.value.jsdate;
        if (ProjectPlanComponent.ctlDepStartDate != null) {
            if (Startdate >= ProjectPlanComponent.ctlDepStartDate) {
                return null;
            }
            else {
                return {
                    startDepDateIssue: {
                        valid: true
                    }

                };
            }
        }
        else {
            return null;
        }
    }

    endDepDateValidation(input: FormControl) {

        if (!input.value) {
            return null;
        }

        var EndDate;

        if (input.value.jsdate == null)
            EndDate = new Date(input.value);
        else
            EndDate = input.value.jsdate;

        if (ProjectPlanComponent.ctlDepEndDate != null) {
            if (EndDate > ProjectPlanComponent.ctlDepEndDate) {
                return null;
            }
            else {
                return {
                    endDepDateIssue: {
                        valid: true
                    }

                };
            }
        }
        else {
            return null;
        }
    }

    endDateCompareValidation(input: FormControl) {

        if (!input.value) {
            return null;
        }

        var EndDate;

        if (input.value.jsdate == null)
            EndDate = new Date(input.value);
        else
            EndDate = input.value.jsdate;

        if (ProjectPlanComponent.ctlStartDate != null) {
            if (input.value != "select end date")
                return (EndDate >= ProjectPlanComponent.ctlStartDate) ? null : { startDatesCompareIssue: true };
            else
                return null;
        }
        else
            return null;
    }

    startDateCompareValidation(input: FormControl) {

        if (!input.value) {
            return null;
        }

        var Startdate;

        if (input.value.jsdate == null)
            Startdate = new Date(input.value);
        else
            Startdate = input.value.jsdate;

        if (ProjectPlanComponent.ctlEndDate != null) {
            if (input.value != "select start date") {
                console.log("ProjectPlanComponent.ctlEndDate " + ProjectPlanComponent.ctlEndDate);
                if (ProjectPlanComponent.ctlEndDate != null) {
                    return (Startdate <= ProjectPlanComponent.ctlEndDate) ? null : { endDatesCompareIssue: true };
                }
                else
                    return null;
            }
            else
                return null;
        }
        else
            return null;
    }

    endDateValidation(input: FormControl) {

        if (!input.value) {
            return null;
        }

        var EndDate;

        if (input.value.jsdate == null)
            EndDate = new Date(input.value);
        else
            EndDate = input.value.jsdate;

        if (EndDate <= ProjectPlanComponent.ProjectEndDate) {
            return null;
        }
        else {
            return {
                endDateIssue: {
                    valid: true
                }

            };
        }
    }


    //Validation Section End

    ngOnInit() {
        this.getprojectactivityplans();
        this.getStages();
    }

    getprojectactivityplans() {
        this.ngProgress.start();
        this._projectplanservice.getProjectActivityPlans(this.FormprojectId).subscribe((data) => {
            this.projectplans = data;
            let max: number = 0;
            let maxdocument = data.map(function (projectactivityplan: IProjectActivityPlan) { if (projectactivityplan.projectActivityPlanID > max) { max = projectactivityplan.projectActivityPlanID } });
            this.ngProgress.done();
        }
            , error => { this.errorMessage = error })
    }

    cancel() {
        this._location.back();
    }
    reset() {
        this.projectplanForm.reset();
    }

    getStages() {
        this._activityService.getStages().subscribe((stages) => {
            this.stages = stages;
            this.projectplanForm.controls["dependency"].setValue("");
        }
            , error => { this.errorMessage = error })
    }


    getActivities(templateid: number) {
        this._activityService.getActivities(templateid).subscribe((act) => {
            this.activityList = act;
        }
            , error => { this.errorMessage = error })
    }

    getdependency(activityid: number) {
        this._activityService.getDependency(activityid).subscribe((dependData) => {
            this.projectplanForm.controls["activity"].setValue(activityid);
            this.projectplanForm.controls["dependency"].setValue(dependData.dependency);
        }
            , error => { this.errorMessage = error })
    }
    delete(id: number) {
        var ans = confirm("Do you want to delete document with Id: " + id);

        if (ans) {
            this._projectplanservice.deleteProjectPlan(id)
                .subscribe(data => {

                    var index = this.projectplans.findIndex(x => x.ProjectPlanID == id);
                    this.projectplans.splice(index, 1);
                }, error => this.errorMessage = error)

        }

    }
    ExportToExcel() {

        var ExportGrid = document.getElementById('exportgrid').innerHTML;
        ExportGrid = ExportGrid.replace("Action", "");
        let blob = new Blob([ExportGrid], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
        });
        saveAs(blob, "ProjectPlan_" + this.FormprojectId + ".xls");

    }

    getDependentDate(activityID: number, Type: string): string {
        let ctdate: string = "";
        this._projectplanservice.getDependentDate(activityID, this.projectplanid, Type)
            .subscribe(resp => {
                ctdate = resp;
            }
            );
        return ctdate;
    }

    onActivitiesChange(activityid: any) {

        var ActivityName = activityid.options[activityid.selectedIndex].text;
        var Activity = activityid.options[activityid.selectedIndex].value;
        this.getdependency(Activity);

        this._projectplanservice.getDependentDate(Activity, this.projectplanid, "StartDate")
            .subscribe(resp => {
                if (resp.length != 0) {

                    ProjectPlanComponent.ctlDepStartDate = new Date(resp);
                }
            }
            );

        this._projectplanservice.getDependentDate(Activity, this.projectplanid, "EndDate")
            .subscribe(resp => {
                if (resp.length != 0) {
                    ProjectPlanComponent.ctlDepEndDate = new Date(resp);
                }
            }
            );


        if (ActivityName == "Add New")
            this.isOtherActivity = true;
        else {

            this._projectplanservice.ValidateActivity(this.projectplanid, Activity)
                .subscribe(resp => {
                    if (resp == 1) {
                        alert("This Activity is already exist");
                        this.projectplanForm.controls['activity'].setValue("");
                        this.projectplanForm.controls['dependency'].setValue("");
                    }
                    if (resp == 2) {
                        alert("Please add Dependent Activity.");

                    }
                }
                );

            this.isOtherActivity = false;
        }

    }

    isActExist(actid: number, projectID: number, projectplanid: number): boolean {

        let actExist: boolean = false;

        this._projectplanservice.isActivityExist(projectplanid, actid.toString())
            .subscribe(resp => {
                actExist = resp;
                return resp;
            }
            );
        return actExist;
    }

    onStageChange(templateid: any) {

        var stageName = templateid.options[templateid.selectedIndex].text;
        var intstageID = templateid.options[templateid.selectedIndex].value;
        this.getActivities(intstageID);
        if (stageName == "Others")
            this.isOtherActivity = true;
        else
            this.isOtherActivity = false;
    }



    add() {

        this.AddMorePlan = true;
    }

    edit(id: number) {
        this.AddMorePlan = true;

    }

    approve() {

        this.objProjectplan.ProjectPlanID = this.projectplanid;
        this.objProjectplan.ProjectID = this.FormprojectId;
        if (this.activeuserdesignation == 'Admin') {
            this.objProjectplan.ProjectPlanStatus = "Approved";
            this.isApproved = true;
        }

        this.objProjectplan.ReopenReason = this.reason.value;

        this.ngProgress.start();
        this._projectplanservice.updateprojectplan(this.objProjectplan);

        setTimeout(() => {
            this.ngProgress.done();
            this._location.back();
        }, 1000);
    }

    reject() {

        this.objProjectplan.ProjectPlanID = this.projectplanid;
        this.objProjectplan.ProjectID = this.FormprojectId;
        if (this.activeuserdesignation == 'Admin') {
            this.objProjectplan.ProjectPlanStatus = "Rejected";
            this.isCreated = true;
        }
        this.objProjectplan.ReopenReason = this.reason.value;

        this.ngProgress.start();
        this._projectplanservice.updateprojectplan(this.objProjectplan);

        setTimeout(() => {
            this.ngProgress.done();
            this._location.back();
        }, 1000);
    }

    submit() {

        this.objProjectplan.ProjectPlanID = this.projectplanid;
        this.objProjectplan.ProjectID = this.FormprojectId;

        this.objProjectplan.ProjectPlanStatus = "Submitted";
        this.isSubmitted = true;

        this.ngProgress.start();
        this._projectplanservice.updateprojectplan(this.objProjectplan);

        setTimeout(() => {
            this.ngProgress.done();
            this._location.back();
        }, 1000);
    }
    reopen() {

        this.objProjectplan.ProjectPlanID = this.projectplanid;
        this.objProjectplan.ProjectID = this.FormprojectId;
        this.objProjectplan.ProjectPlanStatus = "ReOpened";

        this.objProjectplan.ReopenReason = this.reason.value;

        this.ngProgress.start();
        this._projectplanservice.updateprojectplan(this.objProjectplan);

        setTimeout(() => {
            this.ngProgress.done();
            this._location.back();
        }, 1000);
    }

    setDate(): void {
        let date = new Date();
        this.projectplanForm.patchValue({
            endDate: {
                date: {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    day: date.getDate()
                }
            },
            starDate: {
                date: {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    day: date.getDate()
                }
            }
        });
    }
    clearDate(): void {
        this.projectplanForm.patchValue({ endDate: null, starDate: null });
    }

    onDateChanged(event: IMyDateModel) {
        ProjectPlanComponent.ctlStartDate = event.jsdate;
    }

    getActivity(activity: string, projectplanID: number): string {
        if (projectplanID == 0)
            return '<b> ' + activity + ' </b>';
        else
            return activity;
    }

    delay(delay: number): string {

        if (delay > 0)
            return delay.toString() + ' Days';
        else
            return '';
    }

    onEndDateChanged(event: IMyDateModel) {
        ProjectPlanComponent.ctlEndDate = event.jsdate;
    }

    save() {

        if (this.projectplanid > 0)
            this.projectPlanID.setValue(this.projectplanid);


        let startdatestring = "";
        let enddatestring = "";

        if (this.startDate.value != "select start date") {
            startdatestring = this.startDate.value.date.year + '-' + this.startDate.value.date.month + '-' + this.startDate.value.date.day;
            this.startDate.setValue(startdatestring);
        }
        else
            this.startDate.setValue(this.startDate.value.formatted);

        if (this.endDate.value != "select end date") {
            enddatestring = this.endDate.value.date.year + '-' + this.endDate.value.date.month + '-' + this.endDate.value.date.day;
            this.endDate.setValue(enddatestring);
        }
        else
            this.endDate.setValue(this.endDate.value.formatted);

        if (!this.projectplanForm.valid) {
            this.submitted = true;
            return;
        }

        if (this.otherActivity.value != "")
            this.activity.setValue(this.otherActivity.value);
        else
            this.activity.setValue(this.activity.value);


        this._projectplanservice.isActivityExist(this.projectPlanID.value, this.activity.value)
            .subscribe(resp => {
                this.isActivityExist = resp;
            }
            );

        this.ngProgress.start();
        this._projectplanservice.saveProjectActivityPlan(this.projectplanForm.value)
            .subscribe(resp => {
                if (resp.length != 0)
                    this.projectplanid = resp;
            }
            );

        setTimeout(() => {
            this.ngProgress.done();
            this.getprojectactivityplans();
            if (this.isActivityExist == true)
                alert('This Activity is already Exist');
            this.clear();
            this.isActivityExist = false;
        }, 1000);

        ProjectPlanComponent.ctlDepStartDate = null;
        ProjectPlanComponent.ctlDepEndDate = null;
        ProjectPlanComponent.ctlEndDate = null;
        ProjectPlanComponent.ctlStartDate = null;
    }

    clear() {
        this.isOtherActivity = false;
        this.projectplanForm.controls['parentID'].setValue("");
        this.projectplanForm.controls['parentID'].setErrors(null);
        this.projectplanForm.controls['activity'].setValue("");
        this.projectplanForm.controls['otherActivity'].setValue("");
        this.projectplanForm.controls['dependency'].setValue("");
        this.projectplanForm.controls['startDate'].setValue("");
        this.projectplanForm.controls['startDate'].setErrors(null);
        this.projectplanForm.controls['endDate'].setValue("");
        this.projectplanForm.controls['endDate'].setErrors(null);
    }


    get reason() { return this.projectplanForm.get('reason'); }
    get parentID() { return this.projectplanForm.get('parentID'); }
    get activity() { return this.projectplanForm.get('activity'); }
    get otherActivity() { return this.projectplanForm.get('otherActivity'); }
    get dependency() { return this.projectplanForm.get('dependency'); }
    get startDate() { return this.projectplanForm.get('startDate'); }
    get endDate() { return this.projectplanForm.get('endDate'); }
    //get Comment() { return this.projectplanForm.get('Comment'); }
    get projectPlanID() { return this.projectplanForm.get('projectPlanID'); }
}  