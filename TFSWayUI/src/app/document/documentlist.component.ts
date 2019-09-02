import { Component, OnInit, Pipe, PipeTransform } from '@angular/core'
import { IDocument } from './documents';
import { Documentservice } from '../service/document.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { PagerService } from '../service/pager.service';
import { UserService } from '../service/user.service';
let saveAs = require('file-saver');
import * as jsPDF from 'jspdf';

@Component({
    selector: 'app-documentlist',
    templateUrl: 'app/document/documentlist.component.html',
    styleUrls: ['app/document/documentlist.component.css'],
    providers: [Documentservice, PagerService]

})

export class DocumentListComponent implements OnInit {
    public strDocuments: Array<string> = [];
    projectId: number;
    documents: Array<IDocument> = [];
    errorMessage: any;
    currentId: number = 0;
    serarchText: string = '';

    selectedProject: number;
    isNotCompleted: boolean = true;
    IsSelected: boolean = true;
    pager: any = {};
    itemsperpage: number = 5;
    order: string = 'documentName'; //set default
    reverse: boolean = false;
    isexporttoexcel: boolean = true;
    groupName: string;
    companyName: string;
    projectName: string;

    constructor(private _documentservice: Documentservice, private _user: UserService, private _router: Router,
        private _activatedRoute: ActivatedRoute,
        public ngProgress: NgProgress,
        private pagerService: PagerService, private http: Http) {
        this.projectId = _user.ActiveProjectId;
        this.groupName = _user.GroupName;
        this.companyName = _user.CompanyName;
        this.projectName = _user.ProjectName;
    }

    ngOnInit() {

        this.getDocuments();

    }

    getDocuments() {
        this.ngProgress.start();
        this._documentservice.getDocumentDetails(this.projectId).subscribe((documentdata) => {
            this.documents = documentdata;
            let max: number = 0;
            let maxdocument = documentdata.map(function (document: IDocument) { if (document.documentID > max) { max = document.documentID } });
            this.setPage(1);
            this.ngProgress.done();
        }
            , error => { this.errorMessage = error })
    }

    setOrder(value: string) {
        if (this.order === value) {
            this.reverse = !this.reverse;
        }

        this.order = value;
    }

    addOther() {

        this._router.navigate(['/dashboard/document/uploaddocument/']);
    }

    addMaster() {

        this._router.navigate(['/dashboard/masterdocument']);
    }

    edit(id: number) {

        this._router.navigate(['/dashboard/document/uploaddocument/edit/' + id]);

    }
    DownloadDocument(filePath: string) {
        location.href = filePath;
    }

    onChange(e: any, value: string) {

        if (e.target.checked) {
            this.IsSelected = false;
            this.strDocuments.push(value);
        }
        else {
            var index = this.strDocuments.indexOf(value);
            if (index > -1) {
                this.strDocuments.splice(index, 1);
            }
        }

    }

    delete(id: number) {
        var ans = confirm("Do you want to delete document with Id: " + id);

        if (ans) {
            this._documentservice.deleteDocument(id)
                .subscribe(data => {

                    var index = this.documents.findIndex(x => x.documentID == id);
                    this.documents.splice(index, 1);
                }, error => this.errorMessage = error)

        }

    }

    SendMail() {
        let Docid: string = this.strDocuments.toString();
        let Queryid: string = "Doc";
        let SubjectType: string = "Document";
        this._router.navigate(['/dashboard/mail/mail/' + Docid, Queryid, SubjectType]);
    }

    ExportToExcel() {

        var ExportGrid = document.getElementById('exportgrid').innerHTML;
        ExportGrid = ExportGrid.replace("Action", "");
        let blob = new Blob([ExportGrid], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
        });
        saveAs(blob, "DocumentList_" + this.projectId + ".xls");

    }

    public ExportToMSWord(): void {
        var ExportGrid = document.getElementById('exportgrid').innerHTML;
        ExportGrid = ExportGrid.replace("Action", "");
        let blob = new Blob([ExportGrid], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });
        saveAs(blob, "DocumentList_" + this.projectId + ".doc");
    }
    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        this.pager = this.pagerService.getPager(this.documents.length, page, this.itemsperpage);
    }

}