import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { IGroup } from './group';
import { GroupService } from '../service/group.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { PagerService } from '../service/pager.service';
import { UserService } from '../service/user.service'


@Component({
    selector: 'app-grouplist',
    templateUrl: 'app/group/grouplist.component.html',
    styleUrls: ['app/group/grouplist.component.css'],
    providers: [GroupService, PagerService]

})


export class GroupListComponent implements OnInit {

    groups: Array<IGroup> = [];

    // pager object
    pager: any = {};
    itemsperpage: number = 5;
    
    activeuserdesignation: string;

    errorMessage: any;
    submitted: boolean = false;


    order: string = 'groupName'; //set default
    reverse: boolean = false;


    constructor(private _groupservice: GroupService, private _location: Location, private http: Http,
        private _avRoute: ActivatedRoute,
        private _router: Router,
        private pagerService: PagerService,
        public ngProgress: NgProgress, private _user: UserService) {


        this.activeuserdesignation = _user.Designation;
    
        this.getgroups();

    }

    getgroups() {

        this.ngProgress.start();
        this._groupservice.getAllGroups().subscribe((groupdata) => {
            this.groups = groupdata;
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

        this._router.navigate(['/dashboard/group/edit/' + id]);

    }

    //view(id: number) {
    //    this._router.navigate(['/dashboard/group/view/' + id]);
    //}

    delete(group: IGroup) {
        var ans = confirm("Do you want to delete : " + group.companyName);

        if (ans) {
            this._groupservice.deleteGroup(group)
                .subscribe(data => {

                    var index = this.groups.findIndex(x => x.companyId == group.companyId);
                    this.groups.splice(index, 1);
                    this.setPage(1);
                }, error => this.errorMessage = error)

        }

    }

    add() {

        this._router.navigate(['/dashboard/group/add']);
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        // get pager object from service
        this.pager = this.pagerService.getPager(this.groups.length, page, this.itemsperpage);
        
    }

}