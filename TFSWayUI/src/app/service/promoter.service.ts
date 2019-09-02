import { Injectable } from '@angular/core';
import { IPromoter } from '../promoter/promoter';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppConfig } from '../app.config';

@Injectable()
export class PromoterService {

    baseUrl: string = 'Promoter/'
    envURL: string = "";

    constructor(private _http: Http, private config: AppConfig) {

        this.envURL = config.getConfig('envURL');
        this.baseUrl = this.envURL + this.baseUrl;
    }


    getPromoters(companyid: number): Observable<IPromoter[]> {
        return this._http.get(this.baseUrl + 'GetPromoters/' + companyid)
            .map((response: Response) => <IPromoter[]>response.json())
            .catch(this._errorHandler);

    }


    getPromoterby(promoterid: number): Observable<IPromoter> {
        return this._http.get(this.baseUrl + 'GetPromoter/' + promoterid)
            .map((response: Response) => <IPromoter>response.json())
            .catch(this._errorHandler);

    }

    savePromoter(promoter: IPromoter) {

        if (promoter.promoterId == null || promoter.promoterId == 0) {
           // console.log(promoter);
            return this._http.post(this.baseUrl + 'PostPromoter', promoter).map((response: Response) => response.json()).catch(this._errorHandler)
                .subscribe(project => this.getPromoters(0));
        } else {
            return this._http.put(this.baseUrl + 'UpdatePromoter', promoter).map((response: Response) => response.json()).catch(this._errorHandler)
                .subscribe(project => this.getPromoters(0));

        }
    }

    deletePromoter(id: number) {
        return this._http.delete(this.baseUrl + "DeletePromoter/" + id).catch(this._errorHandler)
    }


    _errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error || "Internal server error");
    }

}