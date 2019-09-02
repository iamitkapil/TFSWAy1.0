import { Injectable } from '@angular/core';
import { IReply } from '../query/reply';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppConfig } from '../app.config';

@Injectable()
export class Replyservice {

    baseUrl: string = 'Query/';
    envURL: string = "";

    constructor(private _http: Http, private config: AppConfig) {

        this.envURL = config.getConfig('envURL');
        this.baseUrl = this.envURL + this.baseUrl;
    }

    getReplies(id: number) {
        return this._http.get(this.baseUrl + "GetReplies/" + id)
            .map((response: Response) => <IReply>response.json()).catch(this._errorHandler)
    }


    saveReply(reply: IReply) {
        if (reply.replyId == null || reply.replyId == 0) {
            return this._http.post(this.baseUrl + 'PostReply', reply).map((response: Response) => response.json()).catch(this._errorHandler)
                .subscribe(project => this.getReplies(reply.QueryId));

        }
        else {
            return this._http.put(this.baseUrl + 'UpdateReply', reply).map((response: Response) => response.json()).catch(this._errorHandler)
                .subscribe(project => this.getReplies(reply.QueryId));

        }
    }


    deleteReply(id: number) {

        return this._http.delete(this.baseUrl + "DeleteReply/" + id).catch(this._errorHandler)

    }



    _errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error || "Internal server error");
    }




}