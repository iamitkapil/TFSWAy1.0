import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { CostBreakUpService } from '../service/costbreakup.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Location } from '@angular/common';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { PagerService } from '../service/pager.service';
import { UserService } from '../service/user.service'

@Component({
    selector: 'app-costbreakup',
    templateUrl: 'app/costbreakup/costbreakup.component.html',
    styleUrls: ['app/costbreakup/costbreakup.component.css'],
    providers: [CostBreakUpService, PagerService]
})


export class CostBreakupComponent implements OnInit {
    private activeuserid: number;
    private activeuserdesignation: string;

    costbreakupForm: FormGroup;
    projecttariffunit : string =""
    projectId: number = 0;
    errorMessage: any;
    submitted: boolean = false;
    _ref: any;
     

    constructor(private _fb: FormBuilder, private _location: Location,
        private _avRoute: ActivatedRoute,
        private _costbreakupservice: CostBreakUpService,
        private _router: Router,
        public ngProgress: NgProgress, private _user: UserService) {

        this.activeuserdesignation = _user.Designation;
        this.activeuserid = _user.AuthorisedPersonId;
        this.projectId = _user.ActiveProjectId;
        this.projecttariffunit = _user.ProjectTariffUnit;

        this.costbreakupForm = this._fb.group({
            cbid: 0,
            projectID: 0,
            landSiteCost: ['', [Validators.required, Validators.pattern("\\d*(\\.\\d{0,2})?")]],
            solarModules: ['', [Validators.pattern("\\d*(\\.\\d{0,2})?")]],
            moduleMountStruct: ['', [Validators.pattern("\\d*(\\.\\d{0,2})?")]],
            powerCondUnit: ['', [Validators.pattern("\\d*(\\.\\d{0,2})?")]],
            evacuationCost: ['', [Validators.pattern("\\d*(\\.\\d{0,2})?")]],
            transmissionsys: (''),
            preoperativeexp: ['', [Validators.pattern("\\d*(\\.\\d{0,2})?")]],
            contingency: ['', [Validators.pattern("\\d*(\\.\\d{0,2})?")]],
            idc: ['', [Validators.pattern("\\d*(\\.\\d{0,2})?")]],
            financingCost: ['', [Validators.pattern("\\d*(\\.\\d{0,2})?")]],
            workingcapital: ['', [Validators.pattern("\\d*(\\.\\d{0,2})?")]],
            dsra: ['', [Validators.pattern("\\d*(\\.\\d{0,2})?")]],
            totalCost: ({ value: '', disabled: true }),
            createdDate: (''),
            createdBy: (''),
            updatedDate: (''),
            updatedBy: ('')
        })

        if (this.activeuserdesignation == "Supervisor")
            this.costbreakupForm.disable(true);

    }

    ngOnInit() {
        if (this.projectId > 0) {

            this._costbreakupservice.getCostBreakupbyProjectId(this.projectId)
                .subscribe(resp => this.costbreakupForm.setValue(resp)
                , error => this.errorMessage = error);

        }
    }

    save() {

        //debugger;

        if (!this.costbreakupForm.valid) {
            this.submitted = true;
            return;
        }
        this.ngProgress.start();

        this._costbreakupservice.saveCostBreakup(this.costbreakupForm.value)
        .subscribe(resp =>
            {
            this.errorMessage = resp;
            if (this.errorMessage.includes("Successfully")) {
                //setTimeout(() => {
                //    this._location.back()
                //}, 1000);
            }
            this.ngProgress.done();
            });

        //setTimeout(() => {
        //    this.ngProgress.done();
        //    this._router.navigate(["/dashboard"]);
        //}, 1000);

    }

    getTotalcost(){

        let totalcost = 0;
        if (parseFloat(this.landSiteCost.value) > 0)
            totalcost=totalcost + parseFloat(this.landSiteCost.value);
        if (parseFloat(this.moduleMountStruct.value) > 0)
            totalcost=totalcost + parseFloat(this.moduleMountStruct.value);
        if (parseFloat(this.powerCondUnit.value) > 0)
            totalcost=totalcost + parseFloat(this.powerCondUnit.value);
        if (parseFloat(this.evacuationCost.value) > 0)
            totalcost=totalcost + parseFloat(this.evacuationCost.value);
        if (parseFloat(this.preoperativeexp.value) > 0)
            totalcost=totalcost + parseFloat(this.preoperativeexp.value);
        if (parseFloat(this.contingency.value) > 0)
            totalcost=totalcost + parseFloat(this.contingency.value);
        if (parseFloat(this.idc.value) > 0)
            totalcost=totalcost + parseFloat(this.idc.value);
        if (parseFloat(this.workingcapital.value) > 0)
            totalcost = totalcost + parseFloat(this.workingcapital.value);
        if (parseFloat(this.solarModules.value) > 0)
            totalcost = totalcost + parseFloat(this.solarModules.value);
        if (parseFloat(this.financingCost.value) > 0)
            totalcost = totalcost + parseFloat(this.financingCost.value);
        if (parseFloat(this.dsra.value) > 0)
            totalcost = totalcost + parseFloat(this.dsra.value);


        return totalcost.toFixed(2);
         
    }


    cancel() {
        //this._router.navigate(["/dashboard"]);
        this._location.back();
    }

    get landSiteCost() { return this.costbreakupForm.get('landSiteCost'); }
    get moduleMountStruct() { return this.costbreakupForm.get('moduleMountStruct'); }
    get powerCondUnit() { return this.costbreakupForm.get('powerCondUnit'); }
    get evacuationCost() { return this.costbreakupForm.get('evacuationCost'); }
    get preoperativeexp() { return this.costbreakupForm.get('preoperativeexp'); }
    get contingency() { return this.costbreakupForm.get('contingency'); }
    get idc() { return this.costbreakupForm.get('idc'); }
    get workingcapital() { return this.costbreakupForm.get('workingcapital'); }
    get solarModules() { return this.costbreakupForm.get('solarModules'); }
    get financingCost() { return this.costbreakupForm.get('financingCost');  }
    get dsra() { return this.costbreakupForm.get('dsra') }; 
        


}