import { Injectable } from '@angular/core';
import { IStrategyProposal, IProject } from '../strategyproposal/strategyproposal';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppConfig } from '../app.config';

@Injectable()
export class StrategyProposalservice {

    baseUrl: string = 'StrategyProposal/'
    envURL: string = "";

    constructor(private _http: Http, private config: AppConfig) {

        this.envURL = config.getConfig('envURL');
        this.baseUrl = this.envURL + this.baseUrl;
    }

    getStrategyProposals(projectid: number): Observable<IStrategyProposal[]> {
        return this._http.get(this.baseUrl + 'GetStrategyProposals/' + projectid)
            .map((response: Response) => <IStrategyProposal[]>response.json())
            .catch(this._errorHandler);

    }

    getStrategyProposal(strategyproposalid: number): Observable<IProject> {
        return this._http.get(this.baseUrl + 'GetStrategyProposal/' + strategyproposalid)
            .map((response: Response) => <IProject>response.json())
            .catch(this._errorHandler);

    }

    getnewStrategyProposal(projectid: number): Observable<IProject> {
        return this._http.get(this.baseUrl + 'GetNewStrategyProposal/' + projectid)
            .map((response: Response) => <IProject>response.json())
            .catch(this._errorHandler);

    }

    SaveStrategyProposal(strategyproposal: IStrategyProposal) {

        if (strategyproposal.strategyProposalId == null || strategyproposal.strategyProposalId == 0) {

            return this._http.post(this.baseUrl + 'PostStrategyProposal', strategyproposal).map((response: Response) => response.json()).catch(this._errorHandler)
                .subscribe(project => this.getStrategyProposals(0));
        } else {

            return this._http.put(this.baseUrl + 'UpdateStrategyProposal', strategyproposal).map((response: Response) => response.json()).catch(this._errorHandler)
                .subscribe(project => this.getStrategyProposals(0));
        }

    }

    _errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error || "Internal server error");
    }

}