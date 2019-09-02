import { Component, OnInit, Pipe, PipeTransform } from '@angular/core'
import { ITaskTracker } from './TaskTracker';
import { TaskTrackerService } from '../service/TaskTracker.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { PagerService } from '../service/pager.service';
import { UserService } from '../service/user.service';
import { MailService } from '../service/mail.service';
let saveAs = require('file-saver')

@Component({
    selector: 'app-tasktrackerlist',
    templateUrl: 'app/tasktracker/tasktrackerlist.component.html',
    styleUrls: ['app/tasktracker/tasktrackerlist.component.css'],
    providers: [TaskTrackerService, PagerService, MailService]

})


export class TaskTrackerListComponent implements OnInit {

    projectId: number;
    tasktrackers: Array<ITaskTracker> = [];
    errorMessage: any;
    currentId: number = 0;
    serarchText: string = '';

    selectedProject: number;

    pager: any = {};
    itemsperpage: number = 10
    order: string = 'task'; //set default
    reverse: boolean = true;

    constructor(private _TaskTrackerservice: TaskTrackerService, private _user: UserService, private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _mailservice: MailService,
        public ngProgress: NgProgress,
        private pagerService: PagerService, private http: Http) {
        this.projectId = _user.ActiveProjectId;
     
    }

    ngOnInit() {

        this.getTaskTrackers();

    }

    getTaskTrackers() {
        this.ngProgress.start();
        this._TaskTrackerservice.getTaskTrackers(this.projectId).subscribe((data) => {
            this.tasktrackers = data;
            let max: number = 0;
            let maxdocument = data.map(function (tasktrackers: ITaskTracker) { if (tasktrackers.TaskTrackerID > max) { max = tasktrackers.TaskTrackerID } });
            this.setPage(1);
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

    ExportToExcel() {

        var ExportGrid = document.getElementById('exportgrid').innerHTML;
        ExportGrid = ExportGrid.replace("Action", "");
        ExportGrid = ExportGrid.replace("Send Reminder", "");
        console.log(ExportGrid);
        let blob = new Blob([ExportGrid], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
        });
        saveAs(blob, "TaskTracker_" + this.projectId + ".xls");

    }

    public ExportToMSWord(): void {
        var ExportGrid = document.getElementById('exportgrid').innerHTML;
        ExportGrid = ExportGrid.replace("Action", "");
        ExportGrid = ExportGrid.replace("Send Reminder", "");
        let blob = new Blob([ExportGrid], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });
        saveAs(blob, "TaskTracker_" + this.projectId + ".doc");
    }

    add() {

        this._router.navigate(['/dashboard/tasktracker/add']);
    }

    SendReminder(mailto: string, name: string, activity: string) {

        this._mailservice.sendReminder(mailto, name, activity);
    }

    delete(id: number) {
        var ans = confirm("Do you want to delete document with Id: " + id);

        if (ans) {
            this._TaskTrackerservice.deleteTaskTracker(id)
                .subscribe(data => {

                    var index = this.tasktrackers.findIndex(x => x.TaskTrackerID == id);
                    this.tasktrackers.splice(index, 1);
                }, error => this.errorMessage = error)

        }

    }
    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        this.pager = this.pagerService.getPager(this.tasktrackers.length, page, this.itemsperpage);
    }

}