import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-queryreport',
    templateUrl: 'app/report/queryreport.component.html',
    styleUrls: ['app/report/queryreport.component.css']

})


export class QueryReportComponent implements OnInit {

    constructor(private _location: Location) {

    }

    ngOnInit()
    { }

    cancel() {
        this._location.back();
    }

}