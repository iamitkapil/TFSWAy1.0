import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { IProjectCompany } from '../home/projectcompany';
import { Projectservice } from '../service/project.service';
import { NgProgress } from 'ngx-progressbar';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { PagerService } from '../service/pager.service';
import { UserService } from '../service/user.service'

@Component({
    selector: 'app-maindashboard',
    templateUrl: 'app/maindashboard/maindashboard.component.html',
    styleUrls: ['app/maindashboard/maindashboard.component.css'],
    providers: [Projectservice, PagerService]

})


export class MaindashboardComponent implements OnInit {

    private activeuser: string;
    private activeuserid: number;
    private activeuserdesignation: string;
    public isAdmin: boolean = false;
    errorMessage: any;
    groupName: string;
    companyName: string;
    projectName: string;

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
        this.getProjects();
    }

    getProjects() {
        this.ngProgress.start();
        this._projectservice.getProjects(this.activeuserid, this.activeuserdesignation).subscribe((Projectdata) => {
            if (Projectdata.length != 0) {
                let latestprojectid = Projectdata.reduce((latestpid, u) => Math.max(latestpid, u.project.projectId), 0)

                let maxproject = Projectdata.filter(p => p.project.projectId == latestprojectid)
                if (this._user.ActiveProjectId == 0) {
                    this._user.ActiveProjectId = latestprojectid;
                    this._user.ActiveCompanyId = maxproject[0].project.companyId;
                    this._user.ProjectStartDate = maxproject[0].project.projectStartDate;
                    this._user.ProjectEndDate = maxproject[0].project.projectEndDate;
                    this._user.CompanyName = maxproject[0].company.companyName;
                    this._user.GroupID = maxproject[0].project.groupId;
                    this._user.GroupName = maxproject[0].group.groupName;
                    this._user.ProjectName = maxproject[0].project.projectName;
                    this._user.ProjectTariffUnit = maxproject[0].project.projectTariffUnit;
                    this.groupName = this._user.GroupName;
                    this.companyName = this._user.CompanyName;
                    this.projectName = this._user.ProjectName;
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


            this.ngProgress.done();
        }
            , error => { this.errorMessage = error })
    }

    setactive(pc: IProjectCompany) {
        this._user.ActiveProjectId = pc.project.projectId;
        this._user.ActiveCompanyId = pc.project.companyId;
        this._user.CompanyName = pc.company.companyName;
        this._user.ProjectStartDate = pc.project.projectStartDate;
        this._user.ProjectEndDate = pc.project.projectEndDate;
        this._user.GroupID = pc.project.groupId;
        this._user.GroupName = pc.group.groupName;
        this._user.ProjectName = pc.project.projectName;
        this._user.ProjectTariffUnit = pc.project.projectName;
    }

    public ApplicationchartClicked(e: any): void {
        this._router.navigate(['/dashboard/progressreport']);
    }

    public ActivitychartClicked(e: any): void {
        this._router.navigate(['/dashboard/activityreport']);
    }


    public DocumentchartClicked(e: any): void {
        this._router.navigate(['/dashboard/documentreport']);
    }

    public QuerychartClicked(e: any): void {
        this._router.navigate(['/dashboard/queryreport']);
    }


    // lineChart
    public lineChartData: Array<any> = [
        { data: [65, 59, 80, 81, 56, 55, 40, 80, 81, 56, 55, 40], label: 'Actual' },
        { data: [28, 48, 40, 19, 86, 27, 90, 40, 19, 86, 27, 90], label: 'Planned' }
    ];
    public lineChartLabels: Array<any> = ['Application', 'Screening', 'Appraisal', 'Pre-Sanction', 'Post-Sanction', 'Documentation', 'Post-Documentation', 'First Disbursement', 'Mortgage', 'Module Disbursement', 'SCOD', 'Final Disbursement'];
    public lineChartOptions: any = {
        responsive: true
    };
    public lineChartColors: Array<any> = [
        {
            backgroundColor: 'rgba(245,160,180,0.2)',
            borderColor: 'rgba(245,160,180,1)',
            pointBackgroundColor: 'rgba(245,160,180,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(245,160,180,0.8)'

        },
        {
            backgroundColor: 'rgba(96,164,202,0.2)',
            borderColor: 'rgba(96,164,202,1)',
            pointBackgroundColor: 'rgba(96,164,202,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(96,164,202,0.8)'
        },

    ];
    public lineChartLegend: boolean = true;
    public lineChartType: string = 'line';

    public randomize(): void {
        let _lineChartData: Array<any> = new Array(this.lineChartData.length);
        for (let i = 0; i < this.lineChartData.length; i++) {
            _lineChartData[i] = { data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label };
            for (let j = 0; j < this.lineChartData[i].data.length; j++) {
                _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
            }
        }
        this.lineChartData = _lineChartData;
    }


    // Pie
    public pieChartType: string = 'pie';
    public pieChartLabels: string[] = ['On-Time', 'Pending', 'Completed'];
    public pieChartData: number[] = [300, 500, 100];

    public randomizeType(): void {
        this.lineChartType = this.lineChartType === 'line' ? 'bar' : 'line';
        this.pieChartType = this.pieChartType === 'doughnut' ? 'pie' : 'doughnut';
    }

    // Doughnut
    public doughnutChartLabels: string[] = ['Completed', 'Not Completed'];
    public doughnutChartData: number[] = [350, 450, 100];
    public doughnutChartType: string = 'doughnut';

    // PolarArea
    public polarAreaChartLabels: string[] = ['Open', 'Closed'];
    public polarAreaChartData: number[] = [300, 500, 100, 40, 120];
    public polarAreaLegend: boolean = true;

    public polarAreaChartType: string = 'polarArea';

    // events
    public chartClicked(e: any): void {
        console.log(e);
    }


    public chartHovered(e: any): void {
        console.log(e);
    }


}