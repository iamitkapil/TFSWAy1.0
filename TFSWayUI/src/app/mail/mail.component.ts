import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { NgProgress } from 'ngx-progressbar';
import { UserService } from '../service/user.service'
import { MailService } from '../service/mail.service'
import { IDocument } from '../document/documents';
import { Documentservice } from '../service/document.service';
import { IUser } from '../loginform/user';
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';


@Component({
    selector: 'app-mail',
    templateUrl: 'app/mail/mail.component.html',
    styleUrls: ['app/mail/mail.component.css'],
    providers: [MailService, Documentservice]

})


export class MailComponent implements OnInit {
    mailForm: FormGroup;
    errorMessage: any;
    submitted: boolean = false;
    _ref: any;
    strIDs: string = "";
    strType: string = "";
    strQueryid: string = "";
    strSubjectType: string = "";
    strAttachement: string = "";

    constructor(private _documentservice: Documentservice, private _mailservice: MailService, private _location: Location, private http: Http, private _fb: FormBuilder,
        private _avRoute: ActivatedRoute, public ngProgress: NgProgress, ) {

        if (this._avRoute.snapshot.params["Docid"]) {
            this.strIDs = this._avRoute.snapshot.params["Docid"];
        }
        if (this._avRoute.snapshot.params["type"]) {
            this.strType = this._avRoute.snapshot.params["type"];
        }
        if (this._avRoute.snapshot.params["Queryid"]) {
            this.strQueryid = this._avRoute.snapshot.params["Queryid"];
        }

        if (this._avRoute.snapshot.params["SubjectType"]) {
            this.strSubjectType = this._avRoute.snapshot.params["SubjectType"];
        }

        this.mailForm = this._fb.group({
            to: ['', [Validators.required, Validators.email]],
            cc: (''),
            bcc: (''),
            subject: ['', [Validators.required]],
            attachment: (''),
            body: ('')
        })
    }

    ngOnInit() {
        this.getDocumnetName();
        this.setSubject(this.strSubjectType);

    }

    getDocumnetName() {
        this._documentservice.getDocumentName(this.strIDs, this.strType).subscribe((documentdata) => {
            if (documentdata.length != 0) {
                this.strAttachement = documentdata;
            }
        }
            , error => { this.errorMessage = error })
    }

    cancel() {
        this._location.back();
    }



    setSubject(type: string) {

        if (type == "Query") {
            this.subject.patchValue("Queries Information Required");
        }
        if (type == "Document") {
            this.subject.patchValue("Project Documents");
        }
        if (type == "MOM") {
            this.subject.patchValue("Minutes of meeting");
        }
    }

    SendMail() {

        let mailbody: string = "";

        if (!this.mailForm.valid) {
            this.submitted = true;
            return;
        }

        if (this.cc.value == "")
            this.cc.patchValue("NA");

        if (this.bcc.value == "")
            this.bcc.patchValue("NA");

        if (this.body.value != "") {
            mailbody = this.body.value.replace(/\n/g, '{br}');
            mailbody = mailbody.replace(/\./g, '{.}');
            this.body.patchValue(mailbody);
        }
        console.log(this.body.value);

        if (this.strQueryid == "")
            this.strQueryid = "NA";

        this._mailservice.MailSend(this.to.value, this.cc.value, this.bcc.value, this.subject.value, this.strIDs, this.body.value, this.strQueryid, this.strSubjectType);
        this._location.back();
    }

    get to() { return this.mailForm.get('to'); }
    get cc() { return this.mailForm.get('cc'); }
    get bcc() { return this.mailForm.get('bcc'); }
    get subject() { return this.mailForm.get('subject'); }
    get body() { return this.mailForm.get('body'); }
}