import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Projectservice } from '../service/project.service';
import { NgProgress } from 'ngx-progressbar';
import { UserService } from '../service/user.service'
import { IUser } from '../loginform/user';
import { IDocument } from '../document/documents';
import { Documentservice } from '../service/document.service';
import { ILender } from '../lender/lender';
import { LenderService } from '../service/lender.service';

@Component({
    selector: 'app-uploaddocument',
    templateUrl: 'app/uploaddocument/uploaddocument.component.html',
    styleUrls: ['app/uploaddocument/uploaddocument.component.css'],
    providers: [Documentservice, Projectservice, LenderService]
})

export class UploadDocumentComponent {

    uploadFileForm: FormGroup;
    FormprojectId: number = 0;
    projectID: number = 0;
    lenders: Array<ILender> = [];
    formcreateddate: Date = new Date();
    createdDate: any;
    createdBy: string = "";
    formcreatedby: string = "";
    formdocumentPath: string = "";
    DocumentID: number = 0;
    GroupID: number = 0;
    errorMessage: any;
    submitted: boolean = false;
    IsTemplate: boolean = false;
    IsMasterValue: string = "";
    IsAdd: boolean = true;
    Formfilepath: string = "";
    _ref: any;
    title: string = "Add";

    private isUploadBtn: boolean = true;

    constructor(private _lenderdervice: LenderService, private _location: Location, private http: Http, private _fb: FormBuilder,
        private _avRoute: ActivatedRoute,
        private _projectservice: Projectservice,
        private _documentservice: Documentservice,
        private _router: Router,
        public ngProgress: NgProgress, private _user: UserService) {
        this.FormprojectId = _user.ActiveProjectId;
        this.GroupID = _user.GroupID;
        console.log(this.FormprojectId);
        this.formcreatedby = _user.userName;
        if (this._avRoute.snapshot.params["id"]) {
            this.DocumentID = parseInt(this._avRoute.snapshot.params["id"]);
            console.log(this.DocumentID);
            this.title = 'Edit';
            this.IsAdd = false;
        }

        this.uploadFileForm = this._fb.group({
            documentID: 0,
            projectID: this.FormprojectId,
            groupID: this.GroupID,
            documentName: ['', [Validators.required]],
            filePath: (''),
            documnetType: (''),
            stage: ['', [Validators.required]],
            isMaster: this.IsMasterValue,
            completed: (''),
            createdDate: this.formcreateddate.toUTCString(),
            createdBy: this.formcreatedby
        })

        this.getLenders();


    }

    ngOnInit() {
        if (this.DocumentID > 0) {

            this._documentservice.getDocumentById(this.DocumentID)
                .subscribe(resp => {
                    this.uploadFileForm.patchValue({ documentID: resp.documentID });
                    this.uploadFileForm.controls["documentName"].setValue(resp.documentName);
                    this.uploadFileForm.controls["documnetType"].setValue(resp.documnetType);
                    this.uploadFileForm.controls["stage"].setValue(resp.stage);
                    this.uploadFileForm.controls["completed"].setValue(resp.completed);
                    this.uploadFileForm.controls["isMaster"].setValue(resp.isMaster);
                    this.Formfilepath = resp.filePath;
                    this.uploadFileForm.controls["filePath"].setValue(resp.filePath);
                }
                , error => this.errorMessage = error);

        }
    }

    getLenders() {
        this._lenderdervice.GetLendersbyProjectID(this.FormprojectId).subscribe((lenderdata) => {
            this.lenders = lenderdata;
        }
            , error => { this.errorMessage = error })
    }

    fileChange(event: any) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            console.log(file.name);
            let formData: FormData = new FormData();
            formData.append('uploadFile', file, file.name);
            let headers = new Headers();
            let options = new RequestOptions({ headers: headers });
            let apiUrl1 = "http://tfsapp1.westindia.cloudapp.azure.com/tfswebapi/api/fileupload/uploadjsonfile";
            let fpath = this.http.post(apiUrl1, formData, options)
                .map(res => res)
                .catch(error => Observable.throw(error))
                .subscribe()

            this.uploadFileForm.patchValue({
                filePath: file.name
            });
        }


    }

    onCheckboxChange(deviceValue: any) {
        if (deviceValue == true) {
            this.IsMasterValue = deviceValue;
            this.uploadFileForm.patchValue({
                projectID: this.FormprojectId
            });
        }
        else {
            this.uploadFileForm.patchValue({
                projectID: this.FormprojectId
            });

        }
    }


    cancel() {
        this._location.back();
    }

    save() {

        if (!this.uploadFileForm.valid) {
            this.submitted = true;
            return;
        }

        this.ngProgress.start();
        this._documentservice.saveDocument(this.uploadFileForm.value);

        setTimeout(() => {
            this.ngProgress.done();
            this._location.back();
        }, 1000);

    }

    get documentName() { return this.uploadFileForm.get('documentName'); }
    get documnetType() { return this.uploadFileForm.get('documnetType'); }
    get stage() { return this.uploadFileForm.get('stage'); }
    get completed() { return this.uploadFileForm.get('completed'); }
    get filePath() { return this.uploadFileForm.get('filePath').value; }
    get isMaster() { return this.uploadFileForm.get('isMaster').value; }
}  
