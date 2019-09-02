import { Injectable } from '@angular/core';
import { IGroup } from '../group/group';
import { Http, Response, RequestOptionsArgs } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppConfig } from '../app.config';

@Injectable()
export class GroupService {

    baseUrl: string = 'Group/';
    envURL: string = "";
    constructor(private _http: Http, private config: AppConfig) {

        this.envURL = config.getConfig('envURL');
        this.baseUrl = this.envURL + this.baseUrl;
    }


    getAllGroups(): Observable<IGroup[]> {
        return this._http.get(this.baseUrl + 'GetAllGroups')
            .map((response: Response) => <IGroup[]>response.json())
            .catch(this._errorHandler);

    }

    getGroups(): Observable<IGroup[]> {
        return this._http.get(this.baseUrl + 'GetGroups')
            .map((response: Response) => <IGroup[]>response.json())
            .catch(this._errorHandler);

    }

    getCompanys(): Observable<IGroup[]> {
        return this._http.get(this.baseUrl + 'GetCompanys')
            .map((response: Response) => <IGroup[]>response.json())
            .catch(this._errorHandler);

    }


    // Project is added in the group screen so unique is projectid now 
    getGroup(companyid: number): Observable<IGroup> {
        return this._http.get(this.baseUrl + 'GetGroup/' + companyid)
            .map((response: Response) => <IGroup>response.json())
            .catch(this._errorHandler);

    }

    saveGroup(group: IGroup): Observable<any>{

        if (group.groupId == null || group.groupId == 0) {
            // console.log(group);
            return this._http.post(this.baseUrl + 'PostGroup', group).map((response: Response) => response.json()).catch(this._errorHandler);
                //.subscribe(project => this.getGroups());
        } else {
            return this._http.put(this.baseUrl + 'UpdateGroup', group).map((response: Response) => response.json()).catch(this._errorHandler);
            //    .subscribe(project => this.getGroups());

        }
    }

    deleteGroup(group: IGroup) {

        return this._http.delete(this.baseUrl + "DeleteGroup/", { params: { id: group.projectId }, body: group })
            .map((response: Response) => response.json()).catch(this._errorHandler)
    }


    _errorHandler(error: Response) {
        console.log(error);

        return Observable.throw(error || "Internal server error");
    }

}