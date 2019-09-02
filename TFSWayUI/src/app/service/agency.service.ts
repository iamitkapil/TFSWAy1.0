import { Injectable } from '@angular/core';
import { IAgency } from '../agency/agency';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppConfig } from '../app.config';

@Injectable()
export class AgencyService {

    baseUrl: string = 'Agency/'
    envURL: string = "";

    constructor(private _http: Http, private config: AppConfig) {

        this.envURL = config.getConfig('envURL');
        this.baseUrl = this.envURL + this.baseUrl;
    }

    getAgencys(): Observable<IAgency[]> {
        return this._http.get(this.baseUrl + 'GetAgencys')
            .map((response: Response) => <IAgency[]>response.json())
            .catch(this._errorHandler);

    }


    getAgencysByType(agencytype: string): Observable<IAgency[]> {
        return this._http.get(this.baseUrl + 'GetAgencys/' + agencytype)
            .map((response: Response) => <IAgency[]>response.json())
            .catch(this._errorHandler);

    }

    getAgency(agencyid: number): Observable<IAgency> {
        return this._http.get(this.baseUrl + 'GetAgency/' + agencyid)
            .map((response: Response) => <IAgency>response.json())
            .catch(this._errorHandler);

    }

    saveAgency(agency: IAgency) {

        if (agency.agencyId == null || agency.agencyId == 0) {
           // console.log(agency);
            return this._http.post(this.baseUrl + 'PostAgency', agency).map((response: Response) => response.json()).catch(this._errorHandler)
                .subscribe(project => this.getAgencys());
        } else {
            return this._http.put(this.baseUrl + 'UpdateAgency', agency).map((response: Response) => response.json()).catch(this._errorHandler)
                .subscribe(project => this.getAgencys());

        }
    }

    deleteAgency(id: number) {
        return this._http.delete(this.baseUrl + "DeleteAgency/" + id).catch(this._errorHandler)
    }


    _errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error || "Internal server error");
    }

}