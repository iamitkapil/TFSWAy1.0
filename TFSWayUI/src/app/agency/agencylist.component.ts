import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { IAgency } from './agency';
import { AgencyService } from '../service/agency.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { PagerService } from '../service/pager.service';
import { UserService } from '../service/user.service'
let saveAs = require('file-saver')

@Component({
    selector: 'app-agencylist',
    templateUrl: 'app/agency/agencylist.component.html',
    styleUrls: ['app/agency/agencylist.component.css'],
    providers: [AgencyService, PagerService]

})


export class AgencyListComponent implements OnInit {

    agencys: Array<IAgency> = [];

    // pager object
    pager: any = {};
    itemsperpage: number = 5;
    public isAdmin: boolean = false;
    activeuserdesignation: string;
    FormprojectId: number = 0;
    errorMessage: any;
    submitted: boolean = false;
    order: string = 'agencyName'; //set default
    reverse: boolean = false;


    constructor(private _agencyservice: AgencyService, private _location: Location, private http: Http,
        private _avRoute: ActivatedRoute,
        private _router: Router,
        private pagerService: PagerService,
        public ngProgress: NgProgress, private _user: UserService) {
        this.activeuserdesignation = _user.Designation;
        this.FormprojectId = _user.ActiveProjectId;
        this.getagencys();
        if (this.activeuserdesignation == 'Admin')
            this.isAdmin = true;
        else
            this.isAdmin = false;

    }

    ExportToExcel() {

        var ExportGrid = document.getElementById('exportgrid').innerHTML;
        ExportGrid = ExportGrid.replace("Action", "");
        let blob = new Blob([ExportGrid], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
        });
        saveAs(blob, "MasterAgencyList_" + this.FormprojectId + ".xls");

    }

    getagencys() {

        this.ngProgress.start();
        this._agencyservice.getAgencys().subscribe((agencydata) => {
            this.agencys = agencydata;
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

        this._router.navigate(['/dashboard/agency/edit/' + id]);

    }

    //view(id: number) {
    //    this._router.navigate(['/dashboard/group/view/' + id]);
    //}

    delete(agency: IAgency) {
        var ans = confirm("Do you want to delete : " + agency.agencyName);

        if (ans) {
            this._agencyservice.deleteAgency(agency.agencyId)
                .subscribe(data => {

                    var index = this.agencys.findIndex(x => x.agencyId == agency.agencyId);
                    this.agencys.splice(index, 1);
                    this.setPage(1);
                }, error => this.errorMessage = error)

        }

    }

    add() {

        this._router.navigate(['/dashboard/agency/add']);
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        // get pager object from service
        this.pager = this.pagerService.getPager(this.agencys.length, page, this.itemsperpage);

    }

}