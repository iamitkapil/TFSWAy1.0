import { Injectable } from '@angular/core';
import { IProject, ITeaser, IDirector, IShareholder } from '../teaser/teaser';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppConfig } from '../app.config';

@Injectable()
export class Teaserservice {

    baseUrl: string = 'Teaser/'
    envURL: string = "";

    constructor(private _http: Http, private config: AppConfig) {

        this.envURL = config.getConfig('envURL');
        this.baseUrl = this.envURL + this.baseUrl;
    }

    getTeasers(projectid: number): Observable<ITeaser[]> {
        return this._http.get(this.baseUrl + 'GetTeasers/' + projectid)
            .map((response: Response) => <ITeaser[]>response.json())
            .catch(this._errorHandler);

    }

    getTeaser(teaserid: number): Observable<IProject> {
        return this._http.get(this.baseUrl + 'GetTeaser/' + teaserid)
            .map((response: Response) => <IProject>response.json())
            .catch(this._errorHandler);

    }

    getnewTeaser(projectid: number): Observable<IProject> {
        return this._http.get(this.baseUrl + 'GetNewTeaser/' + projectid)
            .map((response: Response) => <IProject>response.json())
            .catch(this._errorHandler);

    }


    SaveTeaser(teaser: ITeaser) {

        if (teaser.teaserId == null || teaser.teaserId == 0) {

            return this._http.post(this.baseUrl + 'PostTeaser', teaser).map((response: Response) => response.json()).catch(this._errorHandler)
                .subscribe(project => this.getTeasers(0));
        } else {

            return this._http.put(this.baseUrl + 'UpdateTeaser', teaser).map((response: Response) => response.json()).catch(this._errorHandler)
                .subscribe(project => this.getTeasers(0));
        }

    }

    //updateTeaser(teaser: ITeaser) {
    //    return this._http.put(this.baseUrl + 'UpdateTeaser', teaser).map((response: Response) => response.json()).catch(this._errorHandler)
    //        .subscribe(project => this.getTeasers(0));

    //}
    
    _errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error || "Internal server error");
    }

}