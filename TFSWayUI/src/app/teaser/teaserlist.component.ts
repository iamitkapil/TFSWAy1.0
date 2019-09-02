import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { UserService } from '../service/user.service'
import { IUser } from '../loginform/user';
import 'rxjs/add/operator/switchMap';
import { ITeaser } from './teaser';
import { PagerService } from '../service/pager.service';
import { Teaserservice } from '../service/teaser.service';
import { IPromoter } from '../promoter/promoter';
import { PromoterService } from '../service/promoter.service';
let saveAs = require('file-saver');


@Component({
    selector: 'app-teaserlist',
    templateUrl: 'app/teaser/teaserlist.component.html',
    styleUrls: ['app/teaser/teaserlist.component.css'],
    providers: [Teaserservice, PromoterService, PagerService]
})


export class TeaserListComponent implements OnInit {

    teasers: Array<ITeaser> = [];
    promoters: Array<IPromoter> = [];
    projectId: number = null;
    companyId: number = null;
  

    activeuserdesignation: string;

    errorMessage: any;
    submitted: boolean = false;

    pager: any = {};
    itemsperpage: number = 5

    order: string = 'teaserId'; //set default
    reverse: boolean = true;
    public isPromoter: boolean = false;

    constructor(private _teaserservice: Teaserservice, private _location: Location, private http: Http,
        private _avRoute: ActivatedRoute,
        private _promoterservice: PromoterService,
        private _router: Router,
        private pagerService: PagerService,
        public ngProgress: NgProgress, private _user: UserService) {

        this.activeuserdesignation = _user.Designation;
        this.projectId = _user.ActiveProjectId;
        this.companyId = _user.ActiveCompanyId;

        this.getTeasers();
        this.getpromoters();

       


    }

    getTeasers() {
        this.ngProgress.start();
        console.log(this.projectId);
        this._teaserservice.getTeasers(this.projectId).subscribe((teaserdata) => {
            this.teasers = teaserdata;
            this.setPage(1);
            this.ngProgress.done();
        }
            , error => { this.errorMessage = error })
    }

    getpromoters() {
        this._promoterservice.getPromoters(this.companyId).subscribe((promoterdata) => {
            if (promoterdata.length != 0) {
                this.promoters = promoterdata;
                this.isPromoter = true;
            }
            else
                this.isPromoter = false;

            //if (this._user.ActivePromoterId == 0 && promoterdata.length > 0) {
            //    let min: number = Math.min.apply(null, promoterdata.map(o => o.promoterId));
            //    this._user.ActivePromoterId = min;
            //   // this.selectedpromoterId = this._user.ActivePromoterId;
            //}
            //console.log(min);
     
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

        this._router.navigate(['/dashboard/teaser/edit/' + id]);

    }

    view(teaserid: number) {
        this._router.navigate(['/dashboard/teaser/view/' + teaserid]);
    }

    add() {

        this._router.navigate(['/dashboard/teaser/add']);
    }

    ExportToExcel() {

        var ExportGrid = document.getElementById('exportgrid').innerHTML;
        ExportGrid = ExportGrid.replace("Action", "");
        let blob = new Blob([ExportGrid], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
        });
        saveAs(blob, "TeaserList_" + this.projectId + ".xls");

    }

    public ExportToMSWord(): void {
        var ExportGrid = document.getElementById('exportgrid').innerHTML;
        ExportGrid = ExportGrid.replace("Action", "");
        let blob = new Blob([ExportGrid], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });
        saveAs(blob, "TeaserList_" + this.projectId + ".doc");
    }
    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        // get pager object from service
        this.pager = this.pagerService.getPager(this.teasers.length, page, this.itemsperpage);

        // get current page of items
        // this.pagedItems = this.projects.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
}