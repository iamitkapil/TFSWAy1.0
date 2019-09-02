import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-activityreport',
    templateUrl: 'app/report/activityreport.component.html',
    styleUrls: ['app/report/activityreport.component.css']

})


export class ActivityReportComponent implements OnInit {

    constructor(private _location: Location) {

    }

    ngOnInit()
    { }

    cancel() {
        this._location.back();
    }
}