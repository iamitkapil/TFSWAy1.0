import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IUser } from '../loginform/user';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppConfig } from '../app.config';


@Injectable()
export class UserService {

    baseUrl: string = 'User/'
    envURL: string = "";

    private isUserLoggedIn: boolean;
    public userName: string;
    public AuthorisedPersonId: number;
    public Designation: string;
    public queryId: number;
    public ActiveProjectId: number = 0;
    public ActivePromoterId: number = 0;
    public ActiveCompanyId: number = 0;
    public CompanyName: string;
    public ProjectName: string;
    public GroupName: string;
    public ProjectTariffUnit: string;
    public GroupID: number;
    public ProjectStartDate: string;
    public ProjectEndDate: string;
    public ProjectPlanID: number;
    public notifychange: boolean = false;

    constructor(private _http: Http, private config: AppConfig) {
        this.isUserLoggedIn = false;
        this.envURL = config.getConfig('envURL');
        this.baseUrl = this.envURL + this.baseUrl;
    }

    setUserLoggedIn() {
        this.isUserLoggedIn = true;
    }
    getUserLoggedIn() {
        return this.isUserLoggedIn;
    }

    authenticateUser(username: string, password: string): Observable<IUser> {
        return this._http.get(this.baseUrl + 'AuthenticateUser/' + username + '/' + password)
            .map((response: Response) => <IUser>response.json()).catch(this._errorHandler);
    }

    getUserList(userType: string): Observable<IUser[]> {
        return this._http.get(this.baseUrl + 'GetAuthorisedUsers/' + userType)
            .map((response: Response) => <IUser[]>response.json()).catch(this._errorHandler);
    }

    //getSupervisorList(userType: string): Observable<IUser[]> {
    //    return this._http.get(this.baseUrl + 'GetAuthorisedUsers/' + userType)
    //        .map((response: Response) => <IUser[]>response.json()).catch(this._errorHandler);
    //}

    _errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error || "Internal server error");
    }

}