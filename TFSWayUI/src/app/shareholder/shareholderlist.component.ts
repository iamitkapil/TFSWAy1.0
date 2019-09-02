import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { IShareholder } from '../shareholder/shareholder';
import { ShareholderService } from '../service/shareholder.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { PagerService } from '../service/pager.service';
import { UserService } from '../service/user.service'


@Component({
    selector: 'app-shareholderlist',
    templateUrl: 'app/shareholder/shareholderlist.component.html',
    styleUrls: ['app/shareholder/shareholderlist.component.css'],
    providers: [ShareholderService, PagerService]

})


export class ShareholderListComponent implements OnInit {

    shareholders: Array<IShareholder> = [];

    // pager object
    pager: any = {};
    itemsperpage: number = 5;


    projectId: number = null;
    companyId: number = null;
    activeuserdesignation: string;
    errorMessage: any;
    submitted: boolean = false;
    companyName: string = "";
    order: string = 'name';
    reverse: boolean = false;


    constructor(private _shareholderservice: ShareholderService, private _location: Location, private http: Http,
        private _avRoute: ActivatedRoute,
        private _router: Router,
        private pagerService: PagerService,
        public ngProgress: NgProgress, private _user: UserService) {
        this.activeuserdesignation = _user.Designation;
        this.projectId = _user.ActiveProjectId;
        this.companyId = _user.ActiveCompanyId
        this.companyName = _user.CompanyName;
        this.getshareholders();

    }

    getshareholders() {
        this._shareholderservice.getShareholders(this.companyId).subscribe((shareholderdata) => {
            this.shareholders = shareholderdata;
            this.setPage(1);
        }
            , error => { this.errorMessage = error })

    }


    ngOnInit() {

    }

    setOrder(value: string) {
        if (this.order === value) {
            this.reverse = !this.reverse;
        }

        this.order = value;
    }


    edit(id: number) {

        this._router.navigate(['/dashboard/shareholder/edit/' + id]);

    }

    delete(shareholder: IShareholder) {
        var ans = confirm("Do you want to delete shareholder with name: " + shareholder.name);

        if (ans) {
            this._shareholderservice.deleteShareholder(shareholder.shareholderId)
                .subscribe(data => {

                    var index = this.shareholders.findIndex(x => x.shareholderId == shareholder.shareholderId);
                    this.shareholders.splice(index, 1);
                    this.setPage(1);
                }, error => this.errorMessage = error)

        }

    }

    add() {

        this._router.navigate(['/dashboard/shareholder/add']);
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        // get pager object from service
        this.pager = this.pagerService.getPager(this.shareholders.length, page, this.itemsperpage);

        // get current page of items
        // this.pagedItems = this.projects.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

}