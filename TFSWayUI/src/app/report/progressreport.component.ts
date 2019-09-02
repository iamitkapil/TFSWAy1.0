import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-progressreport',
    templateUrl: 'app/report/progressreport.component.html',
    styleUrls: ['app/report/progressreport.component.css']

})


export class ProgressReportComponent implements OnInit {

    constructor(private _location: Location) {

    }

    ngOnInit()
    { }

    cancel() {
        this._location.back();
    }
}