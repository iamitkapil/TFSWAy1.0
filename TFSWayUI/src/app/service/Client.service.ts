import { Injectable } from '@angular/core';
import { IClient } from '../customer/client';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppConfig } from '../app.config';

@Injectable()
export class ClientService {

    baseUrl: string = 'ClientDetail/'
    envURL: string = "";

    constructor(private _http: Http, private config: AppConfig) {

        this.envURL = config.getConfig('envURL');
        this.baseUrl = this.envURL + this.baseUrl;
    }


    getClients(): Observable<IClient[]> {
        return this._http.get(this.baseUrl + 'GetClientDetails')
            .map((response: Response) => <IClient[]>response.json())
            .catch(this._errorHandler);
        
    }


    getClientbyProjectId(projectid: number): Observable<IClient> {
        return this._http.get(this.baseUrl + 'GetClientDetailbyProjectId/' + projectid)
            .map((response: Response) => <IClient>response.json())
            .catch(this._errorHandler);

    }

    saveClient(client: IClient) {
        
        return this._http.put(this.baseUrl + 'UpdateClient', client).map((response: Response) => response.json()).catch(this._errorHandler)
            .subscribe(project => this.getClientbyProjectId(client.projectID));

        }
    

    _errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error || "Internal server error");
    }

}