import { Injectable } from '@angular/core';
import { IDirector } from '../Director/director';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppConfig } from '../app.config';

@Injectable()
export class DirectorService {

    baseUrl: string = 'Director/'
    envURL: string = "";
    constructor(private _http: Http, private config: AppConfig) {

        this.envURL = config.getConfig('envURL');
        this.baseUrl = this.envURL + this.baseUrl;
    }


    getDirectors(id: number): Observable<IDirector[]> {
        return this._http.get(this.baseUrl + 'GetDirectors/' + id)
            .map((response: Response) => <IDirector[]>response.json())
            .catch(this._errorHandler);

    }

    getDirector(directorid: number): Observable<IDirector> {
        return this._http.get(this.baseUrl + 'GetDirector/' + directorid)
            .map((response: Response) => <IDirector>response.json())
            .catch(this._errorHandler);

    }

    saveDirector(director: IDirector) {

        if (director.directorId == null || director.directorId == 0) {
            // console.log(director);
            return this._http.post(this.baseUrl + 'PostDirector', director).map((response: Response) => response.json()).catch(this._errorHandler)
                .toPromise();
        } else {
            return this._http.put(this.baseUrl + 'UpdateDirector', director).map((response: Response) => response.json()).catch(this._errorHandler)
                .toPromise();

        }
    }

    deleteDirector(id: number) {
        return this._http.delete(this.baseUrl + "DeleteDirector/" + id).catch(this._errorHandler)
    }


    _errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error || "Internal server error");
    }

}