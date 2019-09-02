import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { IQuery } from './query';
import { Location } from '@angular/common';
import { Queryservice } from '../service/query.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { PagerService } from '../service/pager.service';
import { HtmlDirective } from '../service/safehtml.service';
import { UserService } from '../service/user.service';
let saveAs = require('file-saver');
import { DomSanitizer, SafeResourceUrl, SafeUrl, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-query',
    templateUrl: 'app/query/queryexporttoexcel.component.html',
    styleUrls: ['app/query/queryexporttoexcel.component.css'],
    providers: [Queryservice, PagerService]
})


export class QueryExporttoExcelComponent implements OnInit {
    projectId: number;
    strQueryIDs: string = "";
    strType: string = "";
    queries: Array<IQuery> = [];
    errorMessage: any;
    currentId: number = 0;
    serarchText: string = '';
    selectedProject: number;
    order: string = 'QueryText';
    reverse: boolean = false;
    trustedDashboardUrl: SafeUrl;

    constructor(private _location: Location, private sanitizer: DomSanitizer, private _queryservice: Queryservice, private _user: UserService, private _router: Router,
        private _activatedRoute: ActivatedRoute,
        public ngProgress: NgProgress,
        private pagerService: PagerService, private http: Http) {
        this.projectId = _user.ActiveProjectId;
        if (this._activatedRoute.snapshot.params["id"]) {
            this.strQueryIDs = this._activatedRoute.snapshot.params["id"];
        }
        if (this._activatedRoute.snapshot.params["type"]) {
            this.strType = this._activatedRoute.snapshot.params["type"];
        }
    }

    ngOnInit() {
        this.ngProgress.start();
        this.getQueries();

        setTimeout(() => {
            this.ngProgress.done();

            if (this.strType == "Excel") {
                let blob = new Blob([document.getElementById('exporttoexcelgrid').innerHTML], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
                });
                saveAs(blob, "Query&IssueList_" + this.projectId + ".xls");
            }
            else {
                let blob = new Blob([document.getElementById('exporttoexcelgrid').innerHTML], {
                    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                });
                saveAs(blob, "Query&IssueList_" + this.projectId + ".doc");
            }
            this._location.back()
        }, 500);


    }

    getQueries() {
        this.ngProgress.start();
        this._queryservice.getExporttoExcelQueries(this.projectId, this.strQueryIDs).subscribe((Querydata) => {
            this.queries = Querydata;
            let max: number = 0;
            let maxquery = Querydata.map(function (query) { if (query.queryId > max) { max = query.queryId } });
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


}