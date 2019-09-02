import { Injectable } from '@angular/core';
import { ILender } from '../lender/lender';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppConfig } from '../app.config';

@Injectable()
export class LenderService {

    baseUrl: string = 'Lender/'
    envURL: string = "";
    constructor(private _http: Http, private config: AppConfig) {

        this.envURL = config.getConfig('envURL');
        this.baseUrl = this.envURL + this.baseUrl;
    }


    getLenders(id:number): Observable<ILender[]> {
        return this._http.get(this.baseUrl + 'GetLenders/'+ id)
            .map((response: Response) => <ILender[]>response.json())
            .catch(this._errorHandler);

    }

    getMasterLenders(): Observable<ILender[]> {
        return this._http.get(this.baseUrl + 'GetLenders' )
            .map((response: Response) => <ILender[]>response.json())
            .catch(this._errorHandler);

    }


    saveLender(lender: ILender) {
       
            return this._http.post(this.baseUrl + 'PostLender', lender).map((response: Response) => response.json()).catch(this._errorHandler)
                .subscribe(project => this.getMasterLenders());

            }

    updateLender(lender: ILender)
    {
        return this._http.put(this.baseUrl + 'UpdateLender', lender).map((response: Response) => response.json()).catch(this._errorHandler)
            .subscribe(project => this.getMasterLenders());

    }

    GetLendersbyProjectID(projectid: number): Observable<ILender[]>
    {
        return this._http.get(this.baseUrl + 'GetLendersbyProjectID/' + projectid)
            .map((response: Response) => <ILender[]>response.json())
            .catch(this._errorHandler);

    }


    _errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error || "Internal server error");
    }

}