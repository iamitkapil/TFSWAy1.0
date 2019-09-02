import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { IProjectCompany } from './projectcompany';
import { Projectservice } from '../service/project.service';
import { NgProgress } from 'ngx-progressbar';
import { IMyDpOptions, IMyDateModel, IMyInputFieldChanged } from 'mydatepicker';
import { UserService } from '../service/user.service';
import { MailService } from '../service/mail.service';
import { IUser } from '../loginform/user';
import { IGroup } from '../group/group'
import { GroupService } from '../service/group.service'

@Component({
    selector: 'app-projectcompany',
    templateUrl: './projectcompany.component.html',
    styleUrls: ['./projectcompany.component.css'],
    providers: [Projectservice, MailService, GroupService]
})

export class ProjectCompanyComponent implements OnInit {

    public static ctlStartDate: Date;
    public static ctlEndDate: Date;
    private activeuserid: number;
    private activeuserdesignation: string;
    public pmList: Array<IUser>;
    isOnHold: boolean = false;
    IsNew: boolean = true;
    public isAdmin: boolean = false;
    public supervisorlist: Array<IUser>;
    public oldProjectManageID: number;
    projecttariffunit: string = "Lakhs";

    groups: Array<IGroup> = [];
    companys: Array<IGroup> = [];
    groupCompanys: Array<IGroup> = []

    public myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd-mm-yyyy',
        height: '23px',
        showInputField: true,
        width: '230px'
    };

    projectForm: FormGroup;
    title: string = "Add";
    projectId: number = 0;
    errorMessage: any;
    submitted: boolean = false;
    _ref: any;

    constructor(private _fb: FormBuilder,
        private _avRoute: ActivatedRoute,
        private _projectservice: Projectservice,
        private _mailservice: MailService,
        private _router: Router,
        private ngProgress: NgProgress, private _user: UserService,
        private _group: GroupService) {

        this.activeuserid = _user.AuthorisedPersonId;
        this.activeuserdesignation = _user.Designation;
        if (this.activeuserdesignation == 'Admin')
            this.isAdmin = true;

        if (this._avRoute.snapshot.params["id"]) {
            this.projectId = parseInt(this._avRoute.snapshot.params["id"]);
            //console.log(this.projectId);
            this.title = 'Edit';
        }

        this.projectForm = this._fb.group({
            projectId: 0,
            groupId: ['', [Validators.required]],
            companyId: ['', [Validators.required]],
            projectName: ['', [Validators.required]],
            projectSize: (''),
            totalDebt: ['', [Validators.pattern("\\d*(\\.\\d{0,2})?")]],
            projectStartDate: ['select start date', [Validators.required, this.startDateCompareValidation]],
            projectEndDate: ['select end date', [Validators.required, this.endDateCompareValidation]],
            planttype: (''),
            projectCapacityUnit: (''),
            projectTariffUnit :(''),
            loaDate: (''),
            registeredAddress: (''),
            supervisorId: [''],
            projectManagerId: [''],
            status: (''),
            reason: (''),
            currentStage: ('')

        })

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

        if (ProjectCompanyComponent.ctlStartDate != null) {
            if (input.value != "select start date")
                return (EndDate > ProjectCompanyComponent.ctlStartDate) ? null : { startDatesCompareIssue: true };
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

        if (ProjectCompanyComponent.ctlEndDate != null) {
            if (input.value != "select end date")
                return (Startdate <= ProjectCompanyComponent.ctlEndDate) ? null : { endDatesCompareIssue: true };
            else
                return null;
        }
        else
            return null;
    }

    ngOnInit() {

        this.getGroups();
        this.getGroupCompanys();
        this.getPMList();
        this.getSupervisorList();

        if (!this.isAdmin) {
            this.projectForm.controls["groupId"].disable();
            this.projectForm.controls["companyId"].disable();
            this.projectForm.controls["projectName"].disable();
            //this.projectForm.controls["totalDebt"].disable();
            this.projectForm.controls["projectStartDate"].disable();
            this.projectForm.controls["projectEndDate"].disable();
            this.projectForm.controls["supervisorId"].disable();
            this.projectForm.controls["projectManagerId"].disable();

        }

        if (this.projectId > 0) {


            //this.IsNew = false;
            this._projectservice.getProjectById(this.projectId)
                .subscribe((resp) => {
                    this.projectForm.patchValue({ projectId: resp.projectId });
                    this.projectForm.controls["groupId"].setValue(resp.groupId);
                    this.groupCompanys = this.companys.filter(c => c.groupId == resp.groupId);
                    this.projecttariffunit = resp.projectTariffUnit;
                    this.projectForm.controls["projectTariffUnit"].setValue(resp.projectTariffUnit);
                    this.projectForm.controls["planttype"].setValue(resp.planttype);
                    this.projectForm.controls["projectCapacityUnit"].setValue(resp.projectCapacityUnit);
                    this.projectForm.controls["companyId"].setValue(resp.companyId);
                    this.projectForm.controls["projectName"].setValue(resp.projectName);
                    this.projectForm.controls["projectSize"].setValue(resp.projectSize);
                    this.projectForm.controls["totalDebt"].setValue(resp.totalDebt);
                    this.projectForm.controls["supervisorId"].setValue(resp.supervisorId);
                    this.projectForm.controls["currentStage"].setValue(resp.currentStage);
                    this.projectForm.controls["projectManagerId"].setValue(resp.projectManagerId);


                    if (resp.projectManagerId != null)
                        this.IsNew = false;
                    else
                        this.IsNew = true

                    this.oldProjectManageID = resp.projectManagerId;
                    if (resp.status == "On Hold" || resp.status == "Completed"/* || resp.status == "Resume"*/) {
                        if (resp.status == "On Hold") {
                            this.isOnHold = true;
                            this.projectForm.controls["status"].setValue("On Hold");
                        }
                        else {
                            this.isOnHold = false;
                            this.projectForm.controls["status"].setValue("Completed");
                        }
                        //if (resp.status == "Resume") {
                        //    this.isOnHold = false;
                        //    this.projectForm.controls["status"].setValue("Resume");
                        //}
                    }
                    else {
                        this.isOnHold = false;
                        if (resp.projectManagerId != null)
                            this.projectForm.controls["status"].setValue("On Going");
                    }

                    this.projectForm.controls["reason"].setValue(resp.reason);
                    this.projectForm.controls["registeredAddress"].setValue(resp.registeredAddress);


                    if (resp.projectStartDate != null) {
                        let startdate = new Date(resp.projectStartDate);

                        this.projectForm.patchValue({
                            projectStartDate: {
                                date: {
                                    year: startdate.getFullYear(),
                                    month: startdate.getMonth() + 1,
                                    day: startdate.getDate()
                                }
                            }
                        });
                    }

                    if (resp.projectEndDate != null) {
                        let enddate = new Date(resp.projectEndDate);


                        this.projectForm.patchValue({
                            projectEndDate: {
                                date: {
                                    year: enddate.getFullYear(),
                                    month: enddate.getMonth() + 1,
                                    day: enddate.getDate()
                                }
                            }
                        });
                    }



                    if (resp.loaDate != null) {
                        let dateofloa = new Date(resp.loaDate);

                        this.projectForm.patchValue({
                            loaDate: {
                                date: {
                                    year: dateofloa.getFullYear(),
                                    month: dateofloa.getMonth() + 1,
                                    day: dateofloa.getDate()
                                }
                            }
                        });
                    }
                }
                , error => this.errorMessage = error);

            ;
        }
        else
            this.IsNew = true;



    }

    getPMList() {
        this._user.getUserList("PM").subscribe((users) => {
            this.pmList = users;
        }
            , error => { this.errorMessage = error })
    }

    onChange(deviceValue: any) {
        if (deviceValue == "On Hold")
            this.isOnHold = true;
        else
            this.isOnHold = false;
    }

    getSupervisorList() {
        this._user.getUserList("Supervisor").subscribe((users) => {
            this.supervisorlist = users;
        }
            , error => { this.errorMessage = error })
    }

    getGroups() {
        this._group.getGroups().subscribe((groups) => {
            this.groups = groups;
        }
            , error => { this.errorMessage = error })

    }
    getGroupCompanys() {
        this._group.getCompanys().subscribe((compnys) => {
            this.companys = compnys;
        }
            , error => { this.errorMessage = error })
    }

    uploadDocumnet() {
        this._router.navigate(['/dashboard/document/uploaddocument/']);
    }

    setDate(): void {
        let date = new Date();
        this.projectForm.patchValue({
            projectEndDate: {
                date: {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    day: date.getDate()
                }
            },
            projectstarDate: {
                date: {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    day: date.getDate()
                }
            }
        });
    }

    clearDate(): void {
        this.projectForm.patchValue({ projectEndDate: null, projectstarDate: null });
    }

    onStartDateChanged(event: IMyDateModel) {
        ProjectCompanyComponent.ctlStartDate = event.jsdate;
    }
    onEndDateChanged(event: IMyDateModel) {
        ProjectCompanyComponent.ctlEndDate = event.jsdate;
    }

    onDateChanged(event: IMyDateModel) {

    }

    onGroupChange(groupId: number) {
        this.companyId.setValue('');
        this.groupCompanys = this.companys.filter(c => c.groupId == groupId);
        this.companyId.setValidators([Validators.required]);
    }

    save() {


        let startdatestring = "";
        let enddatestring = "";
        let loadatestring = "";

        if (this.projectStartDate.value != "select start date") {
            if (this.projectStartDate.value.date != null)
                startdatestring = this.projectStartDate.value.date.year + '-' + this.projectStartDate.value.date.month + '-' + this.projectStartDate.value.date.day;
            else
                startdatestring = this.projectStartDate.value;
            this.projectStartDate.setValue(startdatestring);
        }
        else
            this.projectStartDate.setValue(this.projectStartDate.value.formatted);

        if (this.projectEndDate.value != "select end date") {
            if (this.projectEndDate.value.date != null)
                enddatestring = this.projectEndDate.value.date.year + '-' + this.projectEndDate.value.date.month + '-' + this.projectEndDate.value.date.day;
            else
                enddatestring = this.projectEndDate.value;
            this.projectEndDate.setValue(enddatestring);
        }
        else
            this.projectEndDate.setValue(this.projectEndDate.value.formatted);


        if (this.loaDate.value != "select date of LOA" || this.loaDate.value != "") {
            if (this.loaDate.value.date != null)
                loadatestring = this.loaDate.value.date.year + '-' + this.loaDate.value.date.month + '-' + this.loaDate.value.date.day;
            else
                loadatestring = this.loaDate.value;
            this.loaDate.setValue(loadatestring);
        }
        else
            this.loaDate.setValue(this.loaDate.value.formatted);

        if (this.projectId <= 0)
            this.status.setValue("New Assigned");

        if (this.oldProjectManageID == null && (this.projectManagerId.value != null && this.projectManagerId.value != ""))
            this.status.setValue("New Assigned");

        if (!this.projectForm.valid) {
            this.submitted = true;
            return;
        }
        console.log(" old manager ID" + this.oldProjectManageID);
        console.log(" new manager ID" + this.projectManagerId.value);

        this.ngProgress.start();
        this._projectservice.saveProjectCompany(this.projectForm.value)
            .subscribe(resp => {
                this.errorMessage = resp;
                if (resp.includes("Successfully")) {
                    this._user.notifychange = true;
                    console.log("notifychange:" + this._user.notifychange);
                    console.log("-----------------------------------------------------------");

                    if (this.projectManagerId.value != null && this.projectManagerId.value != "")
                        if (this.oldProjectManageID == null || this.oldProjectManageID == this.projectManagerId.value) {
                            console.log('sendMail');
                            this._mailservice.sendMail(this.projectId);
                        }
                        else {
                            console.log('sendManagerChangeMail');
                            this._mailservice.sendManagerChangeMail(this.projectId, this.oldProjectManageID, this.projectManagerId.value);
                        }
                    console.log("Status" + this.status.value);
                    if (this.status.value == "Resume")
                        this._mailservice.sendMail(this.projectId);

                }
                this.ngProgress.done();
            });


        //setTimeout(() => {
        //    this.ngProgress.done();
        //    this._mailservice.sendMail(this.projectId);
        //    this._router.navigate(["/dashboard"]);
        //}, 2000);

    }

    onChangetariff(unit: string) {

        this.projecttariffunit = unit;
    }

    cancel() {
        this._router.navigate(["/dashboard"]);


    }

    get projectName() { return this.projectForm.get('projectName'); }
    get groupId() { return this.projectForm.get('groupId'); }
    get companyId() { return this.projectForm.get('companyId'); }
    get projectSize() { return this.projectForm.get('projectSize'); }
    get totalDebt() { return this.projectForm.get('totalDebt'); }
    get projectStartDate() { return this.projectForm.get('projectStartDate'); }
    get projectEndDate() { return this.projectForm.get('projectEndDate'); }
    get loaDate() { return this.projectForm.get('loaDate'); }
    get registeredAddress() { return this.projectForm.get('registeredAddress'); }
    get currentStage() { return this.projectForm.get('currentStage').value; }
    get reason() { return this.projectForm.get('reason').value; }
    get supervisorId() { return this.projectForm.get('supervisorId'); }
    get projectManagerId() { return this.projectForm.get('projectManagerId'); }
    get status() { return this.projectForm.get('status'); }

}