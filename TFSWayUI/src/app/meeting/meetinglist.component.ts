import { Component, OnInit } from '@angular/core';
import { MOMService } from '../service/mom.service';
import { Location } from '@angular/common';
import { IMOM } from '../meeting/mom';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { PagerService } from '../service/pager.service';
import { UserService } from '../service/user.service';
import { IMyDpOptions, IMyDateModel, IMyInputFieldChanged } from 'mydatepicker';
let saveAs = require('file-saver')

@Component({
    selector: 'app-meetinglist',
    templateUrl: 'app/meeting/meetinglist.component.html',
    styleUrls: ['app/meeting/meetinglist.component.css'],
    providers: [MOMService, PagerService]

})


export class MeetingListComponent implements OnInit {
    public strMomIds: Array<string> = [];
    projectId: number;
    moms: Array<IMOM> = [];
    errorMessage: any;
    currentId: number = 0;
    serarchText: string = '';
    public AddMore: boolean = false;
    IsSelected: boolean = true;
    selectedProject: number;
    pager: any = {};
    itemsperpage: number = 10
    order: string = 'srNo';
    reverse: boolean = false;
    IsEdit: boolean = false;
    momID: number = 0;
    momForm: FormGroup;
    FormprojectId: number = 0;
    submitted: boolean = false
    formcreateddate: Date = new Date();
    formcreatedby: string = "";
    groupName: string;
    companyName: string;
    projectName: string;
    MOMID: number = 0;

    public myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd-mm-yyyy',
        height: '23px',
        showInputField: true,
        width: '160px'
    };

    objmom = <IMOM>{ momId: null, projectId: null, momType: '', meetingDate: null, minutes: '', taskComplitionDate: null, status: '', createdDate: this.formcreateddate, createdBy: this.formcreatedby };

    constructor(private _mom: MOMService, private _location: Location, private http: Http, private _fb: FormBuilder,
        private _avRoute: ActivatedRoute,
        private _router: Router,
        public ngProgress: NgProgress, private _user: UserService) {
        this.FormprojectId = _user.ActiveProjectId;
        this.formcreatedby = _user.userName;
        this.groupName = _user.GroupName;
        this.companyName = _user.CompanyName;
        this.projectName = _user.ProjectName;

        this.momForm = this._fb.group({
            momId: 0,
            ProjectId: this.FormprojectId,
            MOMType: ['', [Validators.required]],
            MeetingDate: ['', [Validators.required]],
            Minutes: ['', [Validators.required]],
            createdDate: this.formcreateddate.toUTCString(),
            createdBy: this.formcreatedby
        })


    }

    ngOnInit() {
        this.getmoms();
    }

    getmoms() {
        this.ngProgress.start();
        this._mom.getMOMs(this.FormprojectId).subscribe((data) => {
            this.moms = data;
            let max: number = 0;
            let maxdocument = data.map(function (moms: IMOM) { if (moms.momId > max) { max = moms.momId } });
            this.ngProgress.done();
        }
            , error => { this.errorMessage = error })
    }

    add() {
        this.IsEdit = false;
        this.AddMore = true;
    }

    SendMail() {
        let Queryid: string = this.strMomIds.toString();
        let Docid: string = "NA";
        let SubjectType: string = "MOM";
        this._router.navigate(['/dashboard/mail/mail/' + Docid, Queryid, SubjectType]);
    }


    onChange(e: any, value: string) {

        if (e.target.checked) {
            this.IsSelected = false;
            this.strMomIds.push(value);
        }
        else {
            var index = this.strMomIds.indexOf(value);
            if (index > -1) {
                this.strMomIds.splice(index, 1);
            }
        }

    }
    save() {


        let startdatestring = "";
        if (this.MeetingDate.value != "select meeting date" || this.MeetingDate.value != "") {
            if (this.MeetingDate.value.date != null)
                startdatestring = this.MeetingDate.value.date.year + '-' + this.MeetingDate.value.date.month + '-' + this.MeetingDate.value.date.day;
            else
                startdatestring = this.MeetingDate.value;
            this.MeetingDate.setValue(startdatestring);
        }
        else {
            this.MeetingDate.setValue(this.MeetingDate.value.formatted);
        }

        if (!this.momForm.valid) {
            this.submitted = true;
            return;
        }


        this.ngProgress.start();
        this._mom.saveMOM(this.momForm.value);


        setTimeout(() => {
            this.ngProgress.done();
            this.getmoms();
            this.clear();
            this.momForm.patchValue({ MOMType: 'Info' });
        }, 1000);
    }

    delete(id: number) {
        var ans = confirm("Do you want to delete minutes of meeting with Id: " + id);

        if (ans) {
            this._mom.deleteMOM(id)
                .subscribe(data => {

                    var index = this.moms.findIndex(x => x.momId == id);
                    this.moms.splice(index, 1);
                }, error => this.errorMessage = error)

        }

    }

    editMOM(objMOM: IMOM) {

        this.IsEdit = true;
        this.AddMore = true;
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
        this.momForm.controls['MOMType'].setErrors(null);
        this.momForm.controls['Minutes'].setErrors(null);
        this.momForm.patchValue({ momId: objMOM.momId });
    }

    clear() {

        this.momForm.controls['MOMType'].setValue("");
        this.momForm.controls['MOMType'].setErrors(null);
        this.momForm.controls['Minutes'].setValue("");

        this.momForm.controls['Minutes'].setErrors(null);
        this.momForm.controls['MeetingDate'].setValue("");
        this.momForm.controls['MeetingDate'].setErrors(null);

    }

    reset() {
        this.momForm.reset();
    }

    ExportToExcel() {

        var ExportGrid = document.getElementById('exportgrid').innerHTML;
        ExportGrid = ExportGrid.replace("Action", "");
        let blob = new Blob([ExportGrid], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
        });
        saveAs(blob, "Minuts&Meeting_" + this.FormprojectId + ".xls");

    }

    get MOMType() { return this.momForm.get('MOMType'); }
    get MeetingDate() { return this.momForm.get('MeetingDate'); }
    get Minutes() { return this.momForm.get('Minutes'); }

}