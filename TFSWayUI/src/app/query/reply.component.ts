import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Projectservice } from '../service/project.service';
import { NgProgress } from 'ngx-progressbar';
import { UserService } from '../service/user.service'
import { IUser } from '../loginform/user';
import { IReply } from './reply';
import { Queryservice } from '../service/query.service';
import { Replyservice } from '../service/reply.service';

@Component({
    selector: 'app-reply',
    templateUrl: 'app/query/reply.component.html',
    styleUrls: ['app/query/reply.component.css'],
    providers: [Queryservice, Replyservice]

})


export class ReplyComponent implements OnInit {
    replyForm: FormGroup;
    FormpqueryId: number = 0;
    formcreateddate: Date = new Date();
    CreatedDate: any;
    CreatedBy: string = "";
    formcreatedby: string = "";
    queryId: number = 0;
    replyId: number = 0;
    errorMessage: any;
    submitted: boolean = false;
    _ref: any;
    IsReplyAdd: boolean = true;
    title: string = "Query/Reply";

    constructor(private _fb: FormBuilder, private _location: Location,
        private _avRoute: ActivatedRoute,
        private _replyservice: Replyservice,
        private _router: Router,
        public ngProgress: NgProgress, private _user: UserService) {
        this.formcreatedby = _user.userName;
        this.FormpqueryId = _user.queryId;
        if (this._avRoute.snapshot.params["replyId"]) {
            this.replyId = parseInt(this._avRoute.snapshot.params["replyId"]);
            this.title = 'Reply';
            this.IsReplyAdd = false;
            console.log(this.replyId);
        }


        this.replyForm = this._fb.group({
            replyId: this.replyId,
            QueryId: this.FormpqueryId,
            QueryText: (''),
            Querydate: this.formcreateddate.toUTCString(),
            ReplyText: (''),
            ReplyDate: this.formcreateddate.toUTCString(),
            CreatedDate: this.formcreateddate.toUTCString(),
            CreatedBy: this.formcreatedby
        })
    }

    ngOnInit() {


    }

    save() {

        if (!this.replyForm.valid) {
            this.submitted = true;
            return;
        }

        this.ngProgress.start();
        this._replyservice.saveReply(this.replyForm.value);

        setTimeout(() => {
            this.ngProgress.done();
            this._router.navigate(["/dashboard/queriesandissue/replylist/" + this.FormpqueryId]);
        }, 2000);

    }


    cancel() {
        this._location.back();
    }

    get QueryText() { return this.replyForm.get('QueryText'); }
    get ReplyText() { return this.replyForm.get('ReplyText'); }

}