import { Injectable } from '@angular/core';
import { IQuery } from '../query/query';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppConfig } from '../app.config';

@Injectable()
export class Queryservice {

    baseUrl: string = 'Query/'
    envURL: string = "";

    constructor(private _http: Http, private config: AppConfig) {

        this.envURL = config.getConfig('envURL');
        this.baseUrl = this.envURL + this.baseUrl;
    }

    getQueries(projectId: number): Observable<IQuery[]> {
        return this._http.get(this.baseUrl + 'GetQueries/' + projectId)
            .map((response: Response) => <IQuery[]>response.json())
            .catch(this._errorHandler);
    }

    getExporttoExcelQueries(projectId: number, queryIDs:string): Observable<IQuery[]> {
        return this._http.get(this.baseUrl + 'GetExporttoExcelQueries/' + projectId + '/' + queryIDs)
            .map((response: Response) => <IQuery[]>response.json())
            .catch(this._errorHandler);
    }

    getQuerybyId(id: number) {
        return this._http.get(this.baseUrl + "GetQueryReplyByID/" + id)
            .map((response: Response) => <IQuery>response.json()).catch(this._errorHandler)
    }

    saveQueries(query: IQuery) {
        if (query.queryId == null || query.queryId == 0) {
            return this._http.post(this.baseUrl + 'PostQueryReply', query).map((response: Response) => response.json()).catch(this._errorHandler)
                .subscribe(query => this.getQueries(query.ProjectID));

        }
        else {
            return this._http.put(this.baseUrl + 'UpdateQueryReply', query).map((response: Response) => response.json()).catch(this._errorHandler)
                .subscribe(query => this.getQueries(query.ProjectID));

        }
    }

    deleteQuery(id: number) {
        return this._http.delete(this.baseUrl + "DeleteQuery/" + id).catch(this._errorHandler)
    }

    _errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error || "Internal server error");
    }
}