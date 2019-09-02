import { Injectable } from '@angular/core';
import { IAuthorisedPerson } from '../authorizedperson/authorisedperson';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppConfig } from '../app.config';

@Injectable()
export class AuthorisedPersonService {

    baseUrl: string = 'AuthorisedPerson/'
    envURL: string = "";

    constructor(private _http: Http, private config: AppConfig) {

        this.envURL = config.getConfig('envURL');
        this.baseUrl = this.envURL + this.baseUrl;
    }


    getAuthorisedPersons(id:number): Observable<IAuthorisedPerson[]> {
        return this._http.get(this.baseUrl + 'GetAuthorisedPersons/' + id)
            .map((response: Response) => <IAuthorisedPerson[]>response.json())
            .catch(this._errorHandler);

    }
    
    getAuthorisedPerson(id: number): Observable<IAuthorisedPerson> {
        return this._http.get(this.baseUrl + 'GetAuthorisedPerson/' + id)
            .map((response: Response) => <IAuthorisedPerson>response.json())
            .catch(this._errorHandler);

    }

    saveAuthorisedPerson(authorisedperson: IAuthorisedPerson) {

        if (authorisedperson.authorisedPersonId == null || authorisedperson.authorisedPersonId == 0) {
            // console.log(promoter);
            return this._http.post(this.baseUrl + 'PostAuthorisedPerson', authorisedperson).map((response: Response) => response.json()).catch(this._errorHandler)
                .subscribe(project => this.getAuthorisedPersons(0));
        } else {
            return this._http.put(this.baseUrl + 'UpdateAuthorisedPerson', authorisedperson).map((response: Response) => response.json()).catch(this._errorHandler)
                .subscribe(project => this.getAuthorisedPersons(0));

        }
    }


    deleteAuthorisedPerson(id: number) {
        return this._http.delete(this.baseUrl + "DeleteAuthorisedPerson/" + id).catch(this._errorHandler)
    }


    _errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error || "Internal server error");
    }

}