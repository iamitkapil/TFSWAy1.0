import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { IStrategyProposal } from './strategyproposal';
import { StrategyProposalservice } from '../service/strategyproposal.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { PagerService } from '../service/pager.service';
import { UserService } from '../service/user.service'
let saveAs = require('file-saver');

@Component({
    selector: 'app-strategyproposallist',
    templateUrl: 'app/strategyproposal/strategyproposallist.component.html',
    styleUrls: ['app/strategyproposal/strategyproposallist.component.css'],
    providers: [StrategyProposalservice, PagerService]

})


export class StrategyProposalListComponent implements OnInit {

    strategyproposals: Array<IStrategyProposal> = [];

    projectId: number = null;

    activeuserdesignation: string;

    errorMessage: any;
    submitted: boolean = false;

    pager: any = {};
    itemsperpage: number = 10
    order: string = 'projectId'; //set default
    reverse: boolean = true;


    constructor(private _strategyproposalservice: StrategyProposalservice, private _location: Location, private http: Http,
        private _avRoute: ActivatedRoute,
        private _router: Router,
        private pagerService: PagerService,
        public ngProgress: NgProgress, private _user: UserService) {


        this.activeuserdesignation = _user.Designation;
        this.projectId = _user.ActiveProjectId;

        this.getstrategyproposals();

    }

    getstrategyproposals() {
        this.ngProgress.start();
        console.log(this.projectId);
        this._strategyproposalservice.getStrategyProposals(this.projectId).subscribe((strategyproposaldata) => {
            this.strategyproposals = strategyproposaldata;
            this.setPage(1);
            this.ngProgress.done();
        }
            , error => { this.errorMessage = error })

    }


    ngOnInit()
    { }

    setOrder(value: string) {
        if (this.order === value) {
            this.reverse = !this.reverse;
        }

        this.order = value;
    }

    edit(id: number) {

        this._router.navigate(['/dashboard/strategyproposal/edit/' + id]);

    }

    view(id: number) {
        this._router.navigate(['/dashboard/strategyproposal/view/' + id]);
    }


    add() {

        this._router.navigate(['/dashboard/strategyproposal/add']);
    }

    ExportToExcel() {

        var ExportGrid = document.getElementById('exportgrid').innerHTML;
        ExportGrid = ExportGrid.replace("Action", "");
        ExportGrid = ExportGrid.replace("Send Reminder", "");
        console.log(ExportGrid);
        let blob = new Blob([ExportGrid], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
        });
        saveAs(blob, "StrategyProposalList_" + this.projectId + ".xls");

    }

    public ExportToMSWord(): void {
        var ExportGrid = document.getElementById('exportgrid').innerHTML;
        ExportGrid = ExportGrid.replace("Action", "");
        ExportGrid = ExportGrid.replace("Send Reminder", "");
        let blob = new Blob([ExportGrid], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });
        saveAs(blob, "StrategyProposalList_" + this.projectId + ".doc");
    }
    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        this.pager = this.pagerService.getPager(this.strategyproposals.length, page, this.itemsperpage);
    }
}