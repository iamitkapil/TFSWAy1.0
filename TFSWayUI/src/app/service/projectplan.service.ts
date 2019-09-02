import { Injectable } from '@angular/core';
import { IProjectPlan } from '../projectplan/projectplan';
import { Iactivity } from '../projectplan/activity';
import { IProjectActivityPlan } from '../projectplan/projectactivityplan';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppConfig } from '../app.config';

@Injectable()
export class ProjectPlanService {

    baseUrl: string = 'ProjectPlan/'
    envURL: string = "";

    constructor(private _http: Http, private config: AppConfig) {

        this.envURL = config.getConfig('envURL');
        this.baseUrl = this.envURL + this.baseUrl;
    }

    getStagesbyID(id: number) {
        return this._http.get(this.baseUrl + "GetStagesbyID/" + id)
            .map((response: Response) => <Iactivity>response.json()).catch(this._errorHandler)
    }

    getActivitiesbyID(projectid: number, templateid: number): Observable<Iactivity[]> {
        return this._http.get(this.baseUrl + 'getActivitiesbyID/' + projectid + "/" + templateid)
            .map((response: Response) => <Iactivity>response.json()).catch(this._errorHandler)
    }

    getProjectBarGraphData(projectid: number): Observable<any>
    {
        return this._http.get(this.baseUrl + 'GetProjectBarGraphData/' + projectid )
            .map((response: Response) => <any>response.json()).catch(this._errorHandler)
    }

    getProjectPlans(id: number) {
        return this._http.get(this.baseUrl + "GetProjectPlans/" + id)
            .map((response: Response) => <IProjectPlan>response.json()).catch(this._errorHandler)
    }

    isActivityExist(projectplanid: number, activity: string) {
        return this._http.get(this.baseUrl + "IsActivityExist/" + projectplanid + '/' + activity)
            .map((response: Response) => <IProjectActivityPlan>response.json()).catch(this._errorHandler)
    }

    ValidateActivity(projectplanid: number, activity: number) {
        return this._http.get(this.baseUrl + "ValidateActivity/" + projectplanid + '/' + activity)
            .map((response: Response) => <IProjectActivityPlan>response.json()).catch(this._errorHandler)
    }

    getDependentDate(activityid: number, projectplanid: number, type: string) {
        return this._http.get(this.baseUrl + "GetDependentDate/" + activityid + '/' + projectplanid + '/'  + type)
            .map((response: Response) => <IProjectActivityPlan>response.json()).catch(this._errorHandler)
    }
    

    isTaskExist(projectplanid: number, task: string) {
        return this._http.get(this.baseUrl + "IsTaskExist/" + projectplanid + '/' + task)
            .map((response: Response) => <IProjectActivityPlan>response.json()).catch(this._errorHandler)
    }

    getProjectActivityPlans(id: number) {
        return this._http.get(this.baseUrl + "GetProjectActivityPlans/" + id)
            .map((response: Response) => <IProjectActivityPlan>response.json()).catch(this._errorHandler)
    }

    GetProjectActivityPlansbyID(id: number) {
        return this._http.get(this.baseUrl + "GetProjectActivityPlansbyID/" + id)
            .map((response: Response) => <IProjectActivityPlan>response.json()).catch(this._errorHandler)
    }

    saveProjectTaskPlan(projectactivityplan: IProjectActivityPlan): Observable<any> {
        if (projectactivityplan.projectActivityPlanID == null || projectactivityplan.projectActivityPlanID == 0) {
            return this._http.post(this.baseUrl + 'PostActivityTaskPlan', projectactivityplan).map((response: Response) => response.json()).catch(this._errorHandler);

        }
        else {
            return this._http.put(this.baseUrl + 'UpdateProjectActivityPlan', projectactivityplan).map((response: Response) => response.json()).catch(this._errorHandler);

        }
    }

    saveProjectActivityPlan(projectactivityplan: IProjectActivityPlan): Observable<any> {
        if (projectactivityplan.projectActivityPlanID == null || projectactivityplan.projectActivityPlanID == 0) {
            return this._http.post(this.baseUrl + 'PostActivityProjectPlan', projectactivityplan).map((response: Response) => response.json()).catch(this._errorHandler);

        }
        else {
            return this._http.put(this.baseUrl + 'UpdateProjectActivityPlan', projectactivityplan).map((response: Response) => response.json()).catch(this._errorHandler);

        }
    }

    updateprojectplan(projectplan: IProjectPlan) {
        return this._http.put(this.baseUrl + 'UpdateProjectPlan', projectplan).map((response: Response) => response.json()).catch(this._errorHandler)
            .subscribe(projectplan => this.getProjectPlans(0));
    }


    deleteProjectPlan(id: number) {

        return this._http.delete(this.baseUrl + "DeleteProjectPlan/" + id).catch(this._errorHandler)

    }



    _errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error || "Internal server error");
    }




}