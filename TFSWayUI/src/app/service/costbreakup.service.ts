import { Injectable } from '@angular/core';
import { ICostBreakup } from '../costbreakup/costbreakup';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppConfig } from '../app.config';

@Injectable()
export class CostBreakUpService {

    baseUrl: string = 'CostBreakup/'
    envURL: string = "";

    constructor(private _http: Http, private config: AppConfig) {

        this.envURL = config.getConfig('envURL');
        this.baseUrl = this.envURL + this.baseUrl;
    }

    getCostBreakups(): Observable<ICostBreakup[]> {
        return this._http.get(this.baseUrl + 'GetCostBreakups')
            .map((response: Response) => <ICostBreakup[]>response.json())
            .catch(this._errorHandler);

    }


    getCostBreakupbyProjectId(projectid: number): Observable<ICostBreakup> {
        return this._http.get(this.baseUrl + 'GetCostBreakupbyProjectId/' + projectid)
            .map((response: Response) => <ICostBreakup>response.json())
            .catch(this._errorHandler);

    }

    saveCostBreakup(costbreakup: ICostBreakup): Observable<any> {

        return this._http.put(this.baseUrl + 'UpdateCostBreakup', costbreakup).map((response: Response) => response.json()).catch(this._errorHandler)
           // .subscribe(project => this.getCostBreakupbyProjectId(costbreakup.projectID));

    }


    _errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error || "Internal server error");
    }

}