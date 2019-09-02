import { Component } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
@Component({
    selector: 'FileUpload',
    templateUrl: 'app/customer/fileupload.component.html'
    //styleUrls: ['./app/styles/styles.css']
})
export class FileUpload {
    private isUploadBtn: boolean = true;
    constructor(private http: Http) {
    }
    //file upload event  
    fileChange(event:any) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('uploadFile', file, file.name);
            let headers = new Headers()
            //headers.append('Content-Type', 'json');  
            //headers.append('Accept', 'application/json');  
            let options = new RequestOptions({ headers: headers });
            let apiUrl1 = "http://tfsapp1.westindia.cloudapp.azure.com/tfswebapi/api/fileupload/uploadjsonfile";
            this.http.post(apiUrl1, formData, options)
                .map(res => res.json())
                .catch(error => Observable.throw(error))
                .subscribe()         
                
        }
        //window.location.reload();
    }
}  