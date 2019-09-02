import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { IPromoter } from '../promoter/promoter';
import { PromoterService } from '../service/promoter.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { PagerService } from '../service/pager.service';
import { UserService } from '../service/user.service'


@Component({
    selector: 'app-promoterlist',
    templateUrl: 'app/promoter/promoterlist.component.html',
    styleUrls: ['app/promoter/promoterlist.component.css'],
    providers: [PromoterService, PagerService]

})


export class PromoterListComponent implements OnInit {

    promoters: Array<IPromoter> = [];

    // pager object
    pager: any = {};
    itemsperpage: number = 5;


    projectId: number = null;
    companyId: number = null;
  //  selectedpromoterId: number = null;

    activeuserdesignation: string;

    errorMessage: any;
    submitted: boolean = false;


    order: string = 'name'; //set default
    reverse: boolean = false;


    constructor(private _promoterservice: PromoterService, private _location: Location, private http: Http,
        private _avRoute: ActivatedRoute,
        private _router: Router,
        private pagerService: PagerService,
        public ngProgress: NgProgress, private _user: UserService) {


        this.activeuserdesignation = _user.Designation;
        this.projectId = _user.ActiveProjectId;
        this.companyId = _user.ActiveCompanyId
        this.getpromoters();

    }

    getpromoters() {
        this._promoterservice.getPromoters(this.companyId).subscribe((promoterdata) => {
            this.promoters = promoterdata;
            
            //if (this._user.ActivePromoterId == 0 && promoterdata.length > 0) {
            //    let min: number = Math.min.apply(null, promoterdata.map(o => o.promoterID));
            //    this._user.ActivePromoterId = min;
            //    this.selectedpromoterId = this._user.ActivePromoterId;
            //}
            //console.log(min);
            this.setPage(1);
        }
            , error => { this.errorMessage = error })

    }


    ngOnInit() {
    //    this.selectedpromoterId = this._user.ActivePromoterId;

    }

    setOrder(value: string) {
        if (this.order === value) {
            this.reverse = !this.reverse;
        }

        this.order = value;
    }

    setactive(promoter: IPromoter) {
        //this.selectedpromoterId = promoter.promoterID;
        //this._user.ActivePromoterId = promoter.promoterId;
    }

    edit(id: number) {

        this._router.navigate(['/dashboard/promoter/edit/' + id]);

    }


    delete(promoter: IPromoter) {
        var ans = confirm("Do you want to delete promoter: " + promoter.name);

        if (ans) {
            this._promoterservice.deletePromoter(promoter.promoterId)
                .subscribe(data => {

                    var index = this.promoters.findIndex(x => x.promoterId == promoter.promoterId);
                    this.promoters.splice(index, 1);
                    // this.setPage(1);
                }, error => this.errorMessage = error)

        }

    }

    add() {

        this._router.navigate(['/dashboard/promoter/add']);
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        // get pager object from service
        this.pager = this.pagerService.getPager(this.promoters.length, page, this.itemsperpage);

        // get current page of items
        // this.pagedItems = this.projects.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

}