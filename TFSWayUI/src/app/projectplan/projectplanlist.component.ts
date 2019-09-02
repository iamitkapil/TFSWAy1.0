import { Component, OnInit, Pipe, PipeTransform } from '@angular/core'
import { IProjectPlan } from './projectplan';
import { ProjectPlanService } from '../service/projectplan.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { PagerService } from '../service/pager.service';
import { UserService } from '../service/user.service';
let saveAs = require('file-saver')

@Component({
    selector: 'app-projectplanlist.',
    templateUrl: 'app/projectplan/projectplanlist.component.html',
    styleUrls: ['app/projectplan/projectplanlist.component.css'],
    providers: [ProjectPlanService, PagerService]

})


export class ProjectPlanListComponent implements OnInit {

    projectId: number;
    projectplans: Array<IProjectPlan> = [];
    errorMessage: any;
    currentId: number = 0;
    serarchText: string = '';

    selectedProject: number;
    pager: any = {};
    itemsperpage: number = 10
    order: string = 'projectPlanID';
    public isAdmin: boolean = false;
    reverse: boolean = false;
    groupName: string;
    companyName: string;
    projectName: string;

    constructor(private _projectplanservice: ProjectPlanService, private _user: UserService, private _router: Router,
        private _activatedRoute: ActivatedRoute,
        public ngProgress: NgProgress,
        private pagerService: PagerService, private http: Http) {
        this.projectId = _user.ActiveProjectId;
        this.groupName = _user.GroupName;
        this.companyName = _user.CompanyName;
        this.projectName = _user.ProjectName;

        if (_user.Designation == 'Admin')
            this.isAdmin = true;
        else
            this.isAdmin = false;
    }

    ngOnInit() {

        this.getprojectplans();

    }

    getprojectplans() {
        this.ngProgress.start();
        this._projectplanservice.getProjectPlans(this.projectId).subscribe((data) => {
            this.projectplans = data;
            let max: number = 0;
            let maxdocument = data.map(function (projectplan: IProjectPlan) { if (projectplan.ProjectPlanID > max) { max = projectplan.ProjectPlanID } });
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

    add() {

        this._router.navigate(['/dashboard/projectplan/projectactivityplan']);
    }

    edit(id: number, status: string) {

        this._router.navigate(['/dashboard/projectplan/projectactivityplan/edit/' + id, status]);

    }
    delete(id: number) {
        var ans = confirm("Do you want to delete document with Id: " + id);

        if (ans) {
            this._projectplanservice.deleteProjectPlan(id)
                .subscribe(data => {

                    var index = this.projectplans.findIndex(x => x.ProjectPlanID == id);
                    this.projectplans.splice(index, 1);
                }, error => this.errorMessage = error)

        }

    }


}