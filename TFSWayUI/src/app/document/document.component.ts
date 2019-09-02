import { Component, OnInit, Pipe, PipeTransform } from '@angular/core'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NgProgress } from 'ngx-progressbar';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { IUser } from '../loginform/user';
import { IDocument, IDocumentMaster } from '../document/documents';
import { Documentservice } from '../service/document.service';
import 'rxjs/add/operator/switchMap';
import { PagerService } from '../service/pager.service';
import { UserService } from '../service/user.service';
let saveAs = require('file-saver');
import * as jsPDF from 'jspdf';


@Component({
    selector: 'app-document',
    templateUrl: 'app/document/document.component.html',
    styleUrls: ['app/document/document.component.css'],
    providers: [Documentservice, PagerService]

})


export class DocumentComponent implements OnInit {

    DocumentForm: FormGroup;
    public strDocuments: Array<string> = [];
    projectId: number;
    groupid: number;
    documents: Array<IDocument> = [];
    errorMessage: any;
    currentId: number = 0;
    serarchText: string = '';
    formcreateddate: Date = new Date();
    selectedProject: number;
    isNotCompleted: boolean = true;
    IsSelected: boolean = true;
    pager: any = {};
    itemsperpage: number = 5;
    order: string = 'document'; //set default
    reverse: boolean = false;
    isexporttoexcel: boolean = true;
    groupName: string;
    companyName: string;
    projectName: string;
    masterdocs: Array<IDocumentMaster> = [];
    stagenames: Array<string> = [];
    mdocuments: Array<string> = [];
    createdDate: any;
    createdBy: string = "";
    userName: string = "";
    docexist: any;

    objDocument = <IDocument>{ documentID: null, ProjectID: null, GroupID: null, documentName: '', FilePath: '', DocumnetType: '', Stage: '', Completed: '', CreatedDate: this.createdDate, CreatedBy: this.createdBy };

    constructor(private _documentservice: Documentservice, private _fb: FormBuilder, private _user: UserService, private _router: Router,
        private _activatedRoute: ActivatedRoute,
        public ngProgress: NgProgress,
        private pagerService: PagerService, private http: Http) {
        this.projectId = _user.ActiveProjectId;
        this.groupid = _user.GroupID;
        this.groupName = _user.GroupName;
        this.companyName = _user.CompanyName;
        this.projectName = _user.ProjectName;
        this.userName = _user.userName;

    }

    onChange(e: any, docName: string, stagevalue: string) {

        if (e.target.checked) {
            this.objDocument.documentID = 0;
            this.objDocument.ProjectID = this.projectId;
            this.objDocument.GroupID = this.groupid;
            this.objDocument.documentName = docName;
            this.objDocument.FilePath = "";
            this.objDocument.DocumnetType = "";
            this.objDocument.Stage = stagevalue;
            this.objDocument.Completed = "Not Completed";
            this.objDocument.CreatedBy = this.userName;
            this.objDocument.CreatedDate = this.formcreateddate;
            this._documentservice.saveDocument(this.objDocument);
        }
        else {

            var ans = confirm("Do you want to delete this document from Project?");

            if (ans) {
                this._documentservice.deleteMasterDocument(this.projectId, docName)
                    .subscribe(data => {
                    }, error => this.errorMessage = error)

            }
        }

    }

    gotoprojectDocument()
    {
        this._router.navigate(['/dashboard/document/']);
    }

    getDocuments() {
        this.ngProgress.start();
        this._documentservice.getDocumentDetails(this.projectId).subscribe((documentdata) => {
            if (documentdata.length != 0) {
                this.documents = documentdata;
            }
        }
            , error => { this.errorMessage = error })
    }

    checkchecked(docName: string): boolean {
        let checkedValue: boolean = false;
        var filteredmasterdocs = this.documents.findIndex((t: any) => t.documentName == docName);
        if (filteredmasterdocs != -1)
            checkedValue = true;

        return checkedValue;
    }

    getMasterDocuments() {
        this._documentservice.getMasterDocuments().subscribe((documentdata) => {
            if (documentdata.length != 0) {
                this.masterdocs = documentdata;
            }
        }
            , error => { this.errorMessage = error })
    }

    setOrder(value: string) {
        if (this.order === value) {
            this.reverse = !this.reverse;
        }

        this.order = value;
    }

    ngOnInit() {
        this.getMasterDocuments();
        this.getDocuments();
    }
    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        this.pager = this.pagerService.getPager(this.masterdocs.length, page, this.itemsperpage);
    }

}