import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { IUser } from './user';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-loginform',
    templateUrl: 'app/loginform/loginform.component.html',
    styleUrls: ['app/loginform/loginform.component.css']

})


export class LoginFormComponent implements OnInit {

    errorMessage: any;
    loggedinuser = {} as IUser;
    Logindisable: boolean = false;

    constructor(private router: Router, private _user: UserService) {
        let ind = window.navigator.userAgent.indexOf('Firefox');
        if (ind == -1) {
            this.Logindisable = true;
            alert("This application is compatible with Firefox.");
        }
        console.log(window.navigator.userAgent.indexOf('Firefox'));

    }

    ngOnInit() {

    }

    loginUser(e: any) {
        e.preventDefault();
        let username = e.target.elements[0].value;
        let password = e.target.elements[1].value;
        let employeeid: string;

        this._user.authenticateUser(username, password).subscribe(resp => {
            if (resp.employeeId != 'Invalid user') {
                this._user.setUserLoggedIn();
                this._user.userName = resp.firstName + ' ' + resp.lastName
                this._user.AuthorisedPersonId = resp.userID;
                this._user.Designation = resp.designation;
                this.router.navigate(['/dashboard'])
            }
            else {
                this.errorMessage = 'Invalid user'
            }
        }, error => { this.errorMessage = error });
    }
}