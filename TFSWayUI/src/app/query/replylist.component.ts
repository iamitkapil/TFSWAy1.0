import { Component, OnInit, Pipe, PipeTransform } from '@angular/core'
import { IReply } from './reply';
import { Queryservice } from '../service/query.service';
import { Replyservice } from '../service/reply.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { PagerService } from '../service/pager.service';
import { UserService } from '../service/user.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-replylist',
    templateUrl: 'app/query/replylist.component.html',
    styleUrls: ['app/query/replylist.component.css'],
    providers: [Queryservice,Replyservice, PagerService]

})


export class ReplyListComponent implements OnInit {

    queryId: number;
    replies: Array<IReply> = [];
    errorMessage: any;
    currentId: number = 0;
    serarchText: string = '';

    selectedProject: number;

    order: string = 'QueryText';
    reverse: boolean = false;

    constructor(private _queryservice: Queryservice, private _location: Location,private _user: UserService, private _router: Router, private _replyservice: Replyservice,
        private _activatedRoute: ActivatedRoute,
        public ngProgress: NgProgress,
        private pagerService: PagerService, private http: Http) {

        if (this._activatedRoute.snapshot.params["queryId"]) {

            this.queryId = parseInt(this._activatedRoute.snapshot.params["queryId"]);
            this._user.queryId = this.queryId;
        }
    
    }

    ngOnInit() {

        this.getreplies();
      
    }

    getreplies() {
        this.ngProgress.start();
        this._replyservice.getReplies(this.queryId).subscribe((Replydata) => {
            this.replies = Replydata;
            let max: number = 0;
            let maxreply = Replydata.map(function (reply:IReply) { if (reply.QueryId > max) { max = reply.QueryId } });
            this.ngProgress.done();
        }
            , error => { this.errorMessage = error })
    }

    setOrder(value: string) {
        if (this.order === value) {
            this.reverse = !this.reverse;
        }

        this.order = value;
    }

    AddReply(replyId: number)
    {
        this._router.navigate(['/dashboard/queriesandissue/replylist/' + replyId + '/update']);
    }

    add() {

        this._router.navigate(['/dashboard/queriesandissue/replylist/' + this.queryId + '/add']);
    }


    cancel() {
         this._router.navigate(["/dashboard/queriesandissue"]);
        //this._location.back();
    }

    delete(id: number) {
        var ans = confirm("Do you want to delete Query with Id: " + id);

        if (ans) {
            this._replyservice.deleteReply(id)
                .subscribe(data => {

                    var index = this.replies.findIndex(x => x.replyId == id);
                    this.replies.splice(index, 1);
                }, error => this.errorMessage = error)

        }

    }

}