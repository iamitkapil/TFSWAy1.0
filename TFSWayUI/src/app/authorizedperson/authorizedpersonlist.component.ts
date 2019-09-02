import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { IAuthorisedPerson } from './authorisedperson';
import { AuthorisedPersonService } from '../service/authorisedperson.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { PagerService } from '../service/pager.service';
import { UserService } from '../service/user.service'


@Component({
    selector: 'app-authorizedpersonlist',
    templateUrl: 'app/authorizedperson/authorizedpersonlist.component.html',
    styleUrls: ['app/authorizedperson/authorizedpersonlist.component.css'],
    providers: [AuthorisedPersonService, PagerService]

})


export class AuthorizedPersonListComponent implements OnInit {

    authorisedpersons: Array<IAuthorisedPerson> = [];
    pager: any = {};
    itemsperpage: number = 5;
    companyId: number = 0;
    activeuserdesignation: string;
    //clientName: string = "";
    errorMessage: any;
    submitted: boolean = false;
    order: string = 'name'; 
    reverse: boolean = false;


    constructor(private _authorisedpersonservice: AuthorisedPersonService, private _location: Location, private http: Http,
        private _avRoute: ActivatedRoute,
        private _router: Router,
        private pagerService: PagerService,
        public ngProgress: NgProgress, private _user: UserService) {
        this.companyId = _user.ActiveCompanyId;
        this.activeuserdesignation = _user.Designation;
       // this.clientName = _user.ClientName;
        this.getagencys();
    }

    getagencys() {
        this.ngProgress.start();
        this._authorisedpersonservice.getAuthorisedPersons(this.companyId).subscribe((apdata) => {
            this.authorisedpersons = apdata;
            this.setPage(1);
        }
            , error => { this.errorMessage = error })
        this.ngProgress.done();

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

        this._router.navigate(['/dashboard/authorizedperson/edit/' + id]);

    }

    //view(id: number) {
    //    this._router.navigate(['/dashboard/group/view/' + id]);
    //}

    delete(authorisedperson: IAuthorisedPerson) {
        var ans = confirm("Do you want to delete : " + authorisedperson.name);

        if (ans) {
            this._authorisedpersonservice.deleteAuthorisedPerson(authorisedperson.authorisedPersonId)
                .subscribe(data => {

                    var index = this.authorisedpersons.findIndex(x => x.authorisedPersonId == authorisedperson.authorisedPersonId);
                    this.authorisedpersons.splice(index, 1);
                    this.setPage(1);
                }, error => this.errorMessage = error)

        }

    }

    add() {

        this._router.navigate(['/dashboard/authorizedperson/add']);
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        // get pager object from service
        this.pager = this.pagerService.getPager(this.authorisedpersons.length, page, this.itemsperpage);

    }

}