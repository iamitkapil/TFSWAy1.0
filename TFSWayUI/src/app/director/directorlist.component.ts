import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { IDirector } from '../director/director';
import { DirectorService } from '../service/director.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { PagerService } from '../service/pager.service';
import { UserService } from '../service/user.service'


@Component({
    selector: 'app-directorlist',
    templateUrl: 'app/director/directorlist.component.html',
    styleUrls: ['app/director/directorlist.component.css'],
    providers: [DirectorService, PagerService]

})


export class DirectorListComponent implements OnInit {

    directors: Array<IDirector> = [];

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


    constructor(private _directorservice: DirectorService, private _location: Location, private http: Http,
        private _avRoute: ActivatedRoute,
        private _router: Router,
        private pagerService: PagerService,
        public ngProgress: NgProgress, private _user: UserService) {

        console.log(_user.GroupName);
        this.activeuserdesignation = _user.Designation;
        this.projectId = _user.ActiveProjectId;
        this.companyId = _user.ActiveCompanyId
        this.getdirectors();

    }

    getdirectors() {
        this._directorservice.getDirectors(this.companyId).subscribe((directordata) => {
            this.directors = directordata;
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

        this._router.navigate(['/dashboard/director/edit/' + id]);

    }
    
    delete(director: IDirector) {
        var ans = confirm("Do you want to delete director with name: " + director.name);

        if (ans) {
            this._directorservice.deleteDirector(director.directorId)
                .subscribe(data => {

                    var index = this.directors.findIndex(x => x.directorId == director.directorId);
                    this.directors.splice(index, 1);
                    this.setPage(1);
                }, error => this.errorMessage = error)

        }

    }

    add() {

        this._router.navigate(['/dashboard/director/add']);
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        // get pager object from service
        this.pager = this.pagerService.getPager(this.directors.length, page, this.itemsperpage);

        // get current page of items
        // this.pagedItems = this.projects.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

}