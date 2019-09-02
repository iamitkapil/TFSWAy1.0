import { Injectable } from '@angular/core';
import { IDocument } from '../document/documents';
import { Http, Response } from '@angular/http';
import { IMail } from '../mail/mail';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppConfig } from '../app.config';

@Injectable()
export class MailService {

    baseUrl: string = 'SendMail/';
    envURL: string = "";

    constructor(private _http: Http, private config: AppConfig) {

        this.envURL = config.getConfig('envURL');
        this.baseUrl = this.envURL + this.baseUrl;
    }

    sendMail(projectid: number) {
        return this._http.get(this.baseUrl + "SendMail/" + projectid)
            .map(res => res)
            .catch(error => Observable.throw(error))
            .subscribe()
    }

    sendManagerChangeMail(projectid: number, oldmanagerID: number, newmanagerID: number) {
        return this._http.get(this.baseUrl + "SendManagerChangeMail/" + projectid + "/" + oldmanagerID + "/" + newmanagerID)
            .map(res => res)
            .catch(error => Observable.throw(error))
            .subscribe()
    }

    MailSend(to: string, cc: string, bcc: string, subject: string, attachment: string, body: string, queryid: string, type: string) {

        return this._http.get(this.baseUrl + 'MailSend/' + to + "/" + cc + "/" + bcc + "/" + subject + "/" + attachment + "/" + body + "/" + queryid + "/" + type)
            .map(res => res)
            .catch(error => Observable.throw(error))
            .subscribe()
    }

    sendReminder(to: string, name: string, activity: string) {
        return this._http.get(this.baseUrl + "SendReminder/" + to + "/" + name + "/" + activity)
            .map(res => res)
            .catch(error => Observable.throw(error))
            .subscribe()
    }

    _errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error || "Internal server error");
    }
}