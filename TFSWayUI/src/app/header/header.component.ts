import { Component, OnInit, AfterViewInit  } from '@angular/core';
import { UserService } from '../service/user.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

declare var $: any;

@Component({
    selector: 'app-header',
    templateUrl: 'app/header/header.component.html',
    styleUrls: ['app/header/header.component.css']

})


export class HeaderComponent implements OnInit {
    private activeUser: string;
    public groupName: string;
    private CompanyName: string;
    private ProjectName: string;

    constructor(private user: UserService, private route: ActivatedRoute,
        private router: Router, ) {
        this.activeUser = user.userName;
    }

    ngOnInit()
    { }

    Logout()
    {
        this.user.ActiveProjectId = 0;
        this.user.ActiveCompanyId = 0;
        this.user.CompanyName = "";
        this.user.ProjectStartDate = "";
        this.user.ProjectEndDate = "";
        this.user.GroupID = 0;
        this.user.GroupName = "";
        this.user.ProjectName = "";
        
    }
    

    ngAfterViewInit() {
        $(document).ready(function () {
            $("#menu-toggle").click(function (e:any) {
                e.preventDefault();
                $("#wrapper").toggleClass("toggled");
            });

        });
    }
}