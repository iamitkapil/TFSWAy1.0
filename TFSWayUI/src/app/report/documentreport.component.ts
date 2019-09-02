import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-documentreport',
    templateUrl: 'app/report/documentreport.component.html',
    styleUrls: ['app/report/documentreport.component.css']

})


export class DocumentReportComponent implements OnInit {

    constructor(private _location: Location) {

    }

    ngOnInit()
    { }

    cancel() {
        this._location.back();
    }
}