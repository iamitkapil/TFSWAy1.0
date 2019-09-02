import { Injectable } from '@angular/core';
import { ITaskTracker } from '../TaskTracker/TaskTracker';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppConfig } from '../app.config';


@Injectable()
export class TaskTrackerService {


    baseUrl: string = 'TaskTracker/'
    envURL: string = "";

    constructor(private _http: Http, private config: AppConfig) {

        this.envURL = config.getConfig('envURL');
        this.baseUrl = this.envURL + this.baseUrl;
    }

    getTaskTrackers(id: number) {
        return this._http.get(this.baseUrl + "GetTaskTrackers/" + id)
            .map((response: Response) => <ITaskTracker>response.json()).catch(this._errorHandler)
    }

    saveTaskTracker(TaskTracker: ITaskTracker) {
        if (TaskTracker.TaskTrackerID == null || TaskTracker.TaskTrackerID == 0) {
            return this._http.post(this.baseUrl + 'PostTaskTracker', TaskTracker).map((response: Response) => response.json()).catch(this._errorHandler)
                .subscribe(TaskTracker => this.getTaskTrackers(TaskTracker.ProjectID));

        }
        else {
            return this._http.put(this.baseUrl + 'UpdateTaskTracker', TaskTracker).map((response: Response) => response.json()).catch(this._errorHandler)
                .subscribe(TaskTracker => this.getTaskTrackers(0));

        }
    }


    deleteTaskTracker(id: number) {

        return this._http.delete(this.baseUrl + "DeleteTaskTracker/" + id).catch(this._errorHandler)

    }



    _errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error || "Internal server error");
    }




}