import { Injectable } from '@angular/core';
import { IShareholder } from '../shareholder/shareholder';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppConfig } from '../app.config';

@Injectable()
export class ShareholderService {

    baseUrl: string = 'Shareholder/';
    envURL: string = "";

    constructor(private _http: Http, private config: AppConfig) {

        this.envURL = config.getConfig('envURL');
        this.baseUrl = this.envURL + this.baseUrl;
    }


    getShareholders(id: number): Observable<IShareholder[]> {
        return this._http.get(this.baseUrl + 'GetShareholders/' + id)
            .map((response: Response) => <IShareholder[]>response.json())
            .catch(this._errorHandler);

    }

    getShareholder(shareholderid: number): Observable<IShareholder> {
        return this._http.get(this.baseUrl + 'GetShareholder/' + shareholderid)
            .map((response: Response) => <IShareholder>response.json())
            .catch(this._errorHandler);

    }

    saveShareholder(shareholder: IShareholder) {

        if (shareholder.shareholderId == null || shareholder.shareholderId == 0) {
            // console.log(shareholder);
            return this._http.post(this.baseUrl + 'PostShareholder', shareholder).map((response: Response) => response.json()).catch(this._errorHandler)
                .toPromise();
        } else {
            return this._http.put(this.baseUrl + 'UpdateShareholder', shareholder).map((response: Response) => response.json()).catch(this._errorHandler)
                .toPromise();

        }
    }

    deleteShareholder(id: number) {
        return this._http.delete(this.baseUrl + "DeleteShareholder/" + id).catch(this._errorHandler)
    }

    

    _errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error || "Internal server error");
    }

}