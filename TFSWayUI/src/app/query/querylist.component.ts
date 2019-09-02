import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { IQuery } from './query';
import { Queryservice } from '../service/query.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { IDocument } from '../document/documents';
import { Documentservice } from '../service/document.service';
import { IDocumnetRefList } from '../query/DocumnetRefList';
import { PagerService } from '../service/pager.service';
import { UserService } from '../service/user.service';
let saveAs = require('file-saver');
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-querylist',
    templateUrl: 'app/query/querylist.component.html',
    styleUrls: ['app/query/querylist.component.css'],
    providers: [Queryservice, PagerService]

})


export class QueryListComponent implements OnInit {
    public strQuery: Array<string> = [];
    public strDocuments: Array<string> = [];
    projectId: number;
    queries: Array<IQuery> = [];
    errorMessage: any;
    currentId: number = 0;
    serarchText: string = '';
    selectedProject: number;
    trustedDashboardUrl: SafeUrl;
    sendtomailID: string = "";
    clientName: string = "";
    pager: any = {};
    itemsperpage: number = 10
    order: string = 'queryId'; //set default
    reverse: boolean = true;
    IsSelected: boolean = true;
    groupName: string;
    companyName: string;
    projectName: string;

    constructor(private sanitizer: DomSanitizer, private _queryservice: Queryservice, private _user: UserService, private _router: Router,
        private _activatedRoute: ActivatedRoute,
        public ngProgress: NgProgress,
        private pagerService: PagerService, private http: Http) {
        this.projectId = _user.ActiveProjectId;
        this.groupName = _user.GroupName;
        this.companyName = _user.CompanyName;
        this.projectName = _user.ProjectName;
    }

    ngOnInit() {

        this.getQueries();

    }


    getQueries() {
        this.ngProgress.start();
        this._queryservice.getQueries(this.projectId).subscribe((Querydata) => {
            if (Querydata.length != 0) {
                this.queries = Querydata;
                this.sendtomailID = Querydata[0].assignToMailID;
                let max: number = 0;
                let maxquery = Querydata.map(function (query) { if (query.queryId > max) { max = query.queryId } });
            }
            this.setPage(1);
            this.ngProgress.done();
        }
            , error => { this.errorMessage = error })
    }

    onChange(e: any, value: string, documents: string) {

        if (e.target.checked) {
            this.IsSelected = false;
            this.strQuery.push(value);
            this.strDocuments.push(documents);
        }
        else {
            var index = this.strQuery.indexOf(value);
            if (index > -1) {
                this.strQuery.splice(index, 1);
            }
            var indexdoc = this.strDocuments.indexOf(documents);
            if (indexdoc > -1) {
                this.strDocuments.splice(indexdoc, 1);
            }
        }

    }

    setOrder(value: string) {
        if (this.order === value) {
            this.reverse = !this.reverse;
        }

        this.order = value;
    }

    add() {

        this._router.navigate(['/dashboard/queriesandissue/add']);
    }

    ChangeStatus(id: number) {

        this._router.navigate(['/dashboard/queriesandissue/edit/' + id]);

    }




    delete(id: number) {
        var ans = confirm("Do you want to delete Query with Id: " + id);

        if (ans) {
            this._queryservice.deleteQuery(id)
                .subscribe(data => {

                    var index = this.queries.findIndex(x => x.queryId == id);
                    this.queries.splice(index, 1);
                }, error => this.errorMessage = error)

        }

    }
    DownLoadFile(path: string) {
        this.trustedDashboardUrl =
            this.sanitizer.bypassSecurityTrustResourceUrl
                (path);
        window.open(this.trustedDashboardUrl.toString());
    }


    sanitize(url: string) {
        return this.sanitizer.bypassSecurityTrustUrl(url).toString();
    }

    SendMail() {
        let Docid: string = this.strDocuments.toString();
        let Queryid: string = this.strQuery.toString();
        let SubjectType: string = "Query";
        if (Docid == "")
            Docid = "NA";
        this._router.navigate(['/dashboard/mail/mail/' + Docid, Queryid, SubjectType]);
    }

    ExportToMSWord() {

        let id: string = this.strQuery.toString();
        if (id == "")
            id = "All";
        let type: string = "MSWord";

        this._router.navigate(['/dashboard/queriesandissue/exporttoexcel/' + id, type]);
    }

    ExportToExcel() {

        let id: string = this.strQuery.toString();
        if (id == "")
            id = "All";
        let type: string = "Excel";
        this._router.navigate(['/dashboard/queriesandissue/exporttoexcel/' + id, type]);
    }
    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        this.pager = this.pagerService.getPager(this.queries.length, page, this.itemsperpage);
    }
}