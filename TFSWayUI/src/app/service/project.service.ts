import { Injectable } from '@angular/core';
import { IProjectCompany } from '../home/projectcompany';
import { IProject } from '../project/project';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppConfig } from '../app.config';

@Injectable()
export class Projectservice {
    
    baseUrl: string = 'Project/'
    envURL: string = "";

    constructor(private _http: Http, private config: AppConfig) {

        this.envURL = config.getConfig('envURL');
        this.baseUrl = this.envURL + this.baseUrl;
    }
   
    getProjects(employeeid: number, designation: string): Observable<IProjectCompany[]> {
        return this._http.get(this.baseUrl + 'GetDashBoardDetails/' + employeeid + '/' + designation )
            .map((response: Response) => <IProjectCompany[]>response.json())
            .catch(this._errorHandler);
    }

    getProjectById(id: number): Observable<IProject> {
        return this._http.get(this.baseUrl + "GetProject/" + id)
            .map((response: Response) => <IProject>response.json()).catch(this._errorHandler)
    }


    saveProject(project: IProject): Observable<any>{
        if (project.projectId == null || project.projectId == 0) {
            return this._http.post(this.baseUrl + 'PostProject', project).map((response: Response) => response.json()).catch(this._errorHandler)
              //  .subscribe(project => this.getProjects(0, ""));

        } else {
            return this._http.put(this.baseUrl + 'UpdateProject', project).map((response: Response) => response.json()).catch(this._errorHandler)
              //  .subscribe(project => this.getProjects(0,""));

        }
    }

    saveProjectCompany(project: IProject): Observable<string>{
        if (project.projectId == null || project.projectId == 0) {
            return this._http.post(this.baseUrl + 'PostProject', project).map((response: Response) => response.json()).catch(this._errorHandler)
              //  .subscribe(project => this.getProjects(0, ""));

        } else {
            return this._http.put(this.baseUrl + 'UpdateProjectCompany', project).map((response: Response) => response.json()).catch(this._errorHandler)
              //  .subscribe(project => this.getProjects(0, ""));

        }
    }
    
    deleteProject(id: number) {
        return this._http.delete(this.baseUrl + 'DeleteProject/'+ id).catch(this._errorHandler)
    }
    
    getProjectCompany(projectid: number): Observable<IProjectCompany> {
        return this._http.get(this.baseUrl + 'GetProjectCompany/' + projectid)
            .map((response: Response) => <IProjectCompany>response.json())
            .catch(this._errorHandler);

    }

    //saveProject(project: IProject) {

    //    return this._http.put(this.baseUrl + 'UpdateProject', project).map((response: Response) => response.json()).catch(this._errorHandler)
    //        .subscribe(project => this.getProjectCompany(project.projectID));

    //}

    _errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error || "Internal server error");
    }




}