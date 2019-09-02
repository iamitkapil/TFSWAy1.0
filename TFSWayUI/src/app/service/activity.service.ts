import { Injectable } from '@angular/core';
import { Iactivity } from '../projectplan/activity';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppConfig } from '../app.config';

@Injectable()
export class ActivityService {

    baseUrl: string = 'Activities/'
    envURL: string = "";

    constructor(private _http: Http, private config: AppConfig) {

        this.envURL = config.getConfig('envURL');
        this.baseUrl = this.envURL + this.baseUrl;
    }

    getStages() {
        return this._http.get(this.baseUrl + "GetStage")
            .map((response: Response) => <Iactivity>response.json()).catch(this._errorHandler)
    }

    getActivities(templateid: number): Observable<Iactivity[]> {
        return this._http.get(this.baseUrl + 'GetActivityByStage/' + templateid)
            .map((response: Response) => <Iactivity>response.json()).catch(this._errorHandler)
    }

    getDependency(activityid: number) {
        return this._http.get(this.baseUrl + 'Getdepenedency/' + activityid)
            .map((response: Response) => <Iactivity>response.json()).catch(this._errorHandler)
    }

    _errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error || "Internal server error");
    }




}