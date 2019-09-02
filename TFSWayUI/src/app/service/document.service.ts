import { Injectable } from '@angular/core';
import { IDocument, IDocumentMaster } from '../document/documents';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppConfig } from '../app.config';

@Injectable()
export class Documentservice {

    baseUrl: string = 'Document/'
    envURL: string = "";

    constructor(private _http: Http, private config: AppConfig) {

        this.envURL = config.getConfig('envURL');
        this.baseUrl = this.envURL + this.baseUrl;
    }

    getDocuments(id: number) {
        return this._http.get(this.baseUrl + "GetDocuments/" + id)
            .map((response: Response) => <IDocument>response.json()).catch(this._errorHandler)
    }

    getMasterDocuments(): Observable<IDocumentMaster[]> {
        return this._http.get(this.baseUrl + "GetMasterDocuments/")
            .map((response: Response) => <IDocumentMaster[]>response.json()).catch(this._errorHandler)
    }

    getDocumentName(ids: string, type: string) {
        return this._http.get(this.baseUrl + "GetDocumentName/" + ids + '/' + type)
            .map((response: Response) => <IDocument>response.json()).catch(this._errorHandler)
    }

    getDocumentById(id: number) {
        return this._http.get(this.baseUrl + "GetDocumentByID/" + id)
            .map((response: Response) => <IDocument>response.json()).catch(this._errorHandler)
    }

    getDocumentDetails(id: number) {
        return this._http.get(this.baseUrl + "GetDocumentDetails/" + id)
            .map((response: Response) => <IDocument>response.json()).catch(this._errorHandler)
    }


    saveDocument(document: IDocument) {
        if (document.documentID == null || document.documentID == 0) {
            return this._http.post(this.baseUrl + 'PostDocument', document).map((response: Response) => response.json()).catch(this._errorHandler)
                .subscribe(document => this.getDocuments(document.ProjectID));

        } else {
            return this._http.put(this.baseUrl + 'UpdateDocument', document).map((response: Response) => response.json()).catch(this._errorHandler)
                .subscribe(document => this.getDocuments(document.ProjectID));

        }
    }


    deleteDocument(id: number) {

        return this._http.delete(this.baseUrl + "DeleteDocument/" + id).catch(this._errorHandler)

    }

    deleteMasterDocument(projectid: number, documentName: string) {

        return this._http.delete(this.baseUrl + "DeleteDocument/" + projectid + '/' + documentName).catch(this._errorHandler)

    }


    _errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error || "Internal server error");
    }




}