import { Component, OnInit } from '@angular/core'
import { IProjectCompany } from './projectcompany';
import { Projectservice } from '../service/project.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { PagerService } from '../service/pager.service';
import { UserService } from '../service/user.service'



@Component({
    selector: 'app-home',
    templateUrl: 'app/home/home.component.html',
    styleUrls: ['app/home/home.component.css'],
    providers: [Projectservice, PagerService]
})

export class HomeComponent implements OnInit {

    private activeuser: string;
    private activeuserid: number;
    private activeuserdesignation: string;
    public isAdmin: boolean = false;

    projects: Array<IProjectCompany> = [];

    // pager object
    pager: any = {};

    // paged items
    //pagedItems: Array<IProject> = [];

    itemsperpage: number = 5;


    errorMessage: any;
    currentId: number = 0;
    serarchText: string = '';

    selectedProject: number;

    order: string = 'project.projectId'; //set default
    reverse: boolean = true;

    constructor(private _projectservice: Projectservice, private _user: UserService, private _router: Router,
        private _activatedRoute: ActivatedRoute,
        public ngProgress: NgProgress,
        private pagerService: PagerService, private http: Http) {



        this.activeuserid = _user.AuthorisedPersonId// parseInt(this._activatedRoute.snapshot.paramMap.get('authorisedpersonid'));
        this.activeuserdesignation = _user.Designation //this._activatedRoute.snapshot.paramMap.get('designation')
        if (this.activeuserdesignation == 'Admin')
            this.isAdmin = true;

    }

    ngOnInit() {
        this.selectedProject = this._user.ActiveProjectId;

        this.getProjects();

        //console.log(this.order);
        //console.log(this.reverse);
    }

    getProjects() {
        this.ngProgress.start();
        this._projectservice.getProjects(this.activeuserid, this.activeuserdesignation).subscribe((Projectdata) => {
            if (Projectdata.length != 0) {
                this.projects = Projectdata;
                let latestprojectid = Projectdata.reduce((latestpid, u) => Math.max(latestpid, u.project.projectId), 0)

                let maxproject = Projectdata.filter(p => p.project.projectId == latestprojectid)
                if (this._user.ActiveProjectId == 0) {
                    this._user.ActiveProjectId = latestprojectid;
                    this._user.ActiveCompanyId = maxproject[0].project.companyId;
                    this.selectedProject = latestprojectid;
                    this._user.ProjectStartDate = maxproject[0].project.projectStartDate;
                    this._user.ProjectEndDate = maxproject[0].project.projectEndDate;
                    this._user.CompanyName = maxproject[0].company.companyName;
                    this._user.GroupID = maxproject[0].project.groupId;
                    this._user.GroupName = maxproject[0].group.groupName;
                    this._user.ProjectName = maxproject[0].project.projectName;
                    this._user.ProjectTariffUnit = maxproject[0].project.projectTariffUnit;
                }
                else if (this._user.notifychange == true) {
                    let currentproject = Projectdata.filter(p => p.project.projectId == this._user.ActiveProjectId);
                    this.setactive(currentproject[0]);
                    this._user.notifychange = false;
                }

                console.log("notifychange:" + this._user.notifychange);
                console.log("ProjectEndDate:" + this._user.ProjectEndDate);
                console.log("--------------------------------------------------------------------------");
            }
            this.setPage(1);

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


    setactive(pc: IProjectCompany) {
        this.selectedProject = pc.project.projectId;
        this._user.ActiveProjectId = pc.project.projectId;
        this._user.ActiveCompanyId = pc.project.companyId;
        this._user.CompanyName = pc.company.companyName;
        this._user.ProjectStartDate = pc.project.projectStartDate;
        this._user.ProjectEndDate = pc.project.projectEndDate;
        this._user.GroupID = pc.project.groupId;
        this._user.GroupName = pc.group.groupName;
        this._user.ProjectName = pc.project.projectName;
        this._user.ProjectTariffUnit = pc.project.projectTariffUnit;
    }


    add() {

        this._router.navigate(['/dashboard/projectcompany/add']);
    }

    edit(id: number) {

        this._router.navigate(['/dashboard/projectcompany/edit/' + id]);

    }

    delete(pc: IProjectCompany) {
        var ans = confirm("Do you want to delete Project : " + pc.project.projectName);

        if (ans) {
            this._projectservice.deleteProject(pc.project.projectId)
                .subscribe(data => {

                    var index = this.projects.findIndex(x => x.project.projectId == pc.project.projectId);
                    this.projects.splice(index, 1);
                    this.setPage(1);
                }, error => this.errorMessage = error)

        }

    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        this.pager = this.pagerService.getPager(this.projects.length, page, this.itemsperpage);
    }
}