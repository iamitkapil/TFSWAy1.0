import { Injectable } from '@angular/core';
import { IMOM } from '../meeting/mom';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppConfig } from '../app.config';

@Injectable()
export class MOMService {

    baseUrl: string = 'MOM/'
    envURL: string = "";

    constructor(private _http: Http, private config: AppConfig) {

        this.envURL = config.getConfig('envURL');
        this.baseUrl = this.envURL + this.baseUrl;
    }

    getMOMs(id: number) {
        return this._http.get(this.baseUrl + "GetMOMs/" + id)
            .map((response: Response) => <IMOM>response.json()).catch(this._errorHandler)
    }

    getMOMTasks(id: number) {
        return this._http.get(this.baseUrl + "GetMOMTasks/" + id)
            .map((response: Response) => <IMOM>response.json()).catch(this._errorHandler)
    }

    saveMOM(mom: IMOM) {
        if (mom.momId== null || mom.momId == 0) {
            return this._http.post(this.baseUrl + 'PostMOM', mom).map((response: Response) => response.json()).catch(this._errorHandler)
                .subscribe(mom => this.getMOMs(mom.id));
        }
        else {
            return this._http.put(this.baseUrl + 'UpdateMOM', mom).map((response: Response) => response.json()).catch(this._errorHandler)
                .subscribe(mom => this.getMOMs(mom.id));
        }
    }

    deleteMOM(id: number) {

        return this._http.delete(this.baseUrl + "DeleteMOM/" + id).catch(this._errorHandler)

    }

    _errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error || "Internal server error");
    }

}