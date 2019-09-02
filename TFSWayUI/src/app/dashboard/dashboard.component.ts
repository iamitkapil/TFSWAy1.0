import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: 'app/dashboard/dashboard.component.html',
    //styleUrls: ['app/dashboard/dashboard.component.css']

})

export class DashBoardComponent implements OnInit {

    constructor(private user: UserService) { }

    ngOnInit()
    { }


}