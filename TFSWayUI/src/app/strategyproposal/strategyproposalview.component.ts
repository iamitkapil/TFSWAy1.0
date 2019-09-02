import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs/Rx';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { UserService } from '../service/user.service'
import { IProject, IStrategyProposal } from './strategyproposal';
import { StrategyProposalservice } from '../service/strategyproposal.service';
import { NgProgress } from 'ngx-progressbar';
let saveAs = require('file-saver');

@Component({
    selector: 'app-strategyproposalview',
    templateUrl: 'app/strategyproposal/strategyproposalview.component.html',
    styleUrls: ['app/strategyproposal/strategyproposalview.component.css'],
    providers: [StrategyProposalservice]

})


export class StrategyProposalviewComponent implements OnInit {

    project: IProject = null;
    projectId: number = null;
    strategyproposalid: number = null;
    activeuserdesignation: string;
    strategyProposalForm: FormGroup;
    errorMessage: any;

    StrategyProposalsubmitted: boolean = false;
    updatedbyuser: string = null;
    updateddate: string = new Date().toISOString().slice(0, 10);


    constructor(private _strategyproposalservice: StrategyProposalservice,
        private _fb: FormBuilder,
        private _location: Location, private http: Http,
        private _avRoute: ActivatedRoute,
        private _router: Router,
        private _user: UserService,
        private ngProgress: NgProgress) {

        this.activeuserdesignation = _user.Designation;
        this.projectId = _user.ActiveProjectId;

        if (this._avRoute.snapshot.params["id"]) {
            this.strategyproposalid = parseInt(this._avRoute.snapshot.params["id"]);
        }

        this.strategyProposalForm = this._fb.group({

            remarks: ('')
        })

    }

    ngOnInit()
    {

        console.log(this.strategyproposalid);
        this._strategyproposalservice.getStrategyProposal(this.strategyproposalid).subscribe((data) => {
            this.project = data;
            //console.log(this.project);
            //console.log(this.project.projectGroup);
            this.StrategyProposalsubmitted = data.strategyProposal.status != "Created" ? true : false;
            if (this.StrategyProposalsubmitted) {
                this.remarks.setValue(data.strategyProposal.remarks);
                this.remarks.disable(true);
            }
        }     , error => { this.errorMessage = error })


    }

    public ExportToMSWord(): void {
        console.log('ExportToMSWord');
        var ExportGrid = document.getElementById('exportgrid').innerHTML;
        let blob = new Blob([ExportGrid], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });
        saveAs(blob, "StrategyProposal_" + this.projectId + ".doc");
    }
    save(status: string) {

        this.project.strategyProposal.status = status;
        this.project.strategyProposal.updatedDate = this.updateddate;
        this.project.strategyProposal.updatedBy = this.updatedbyuser;
        this.project.strategyProposal.remarks = this.remarks.value;
        this.ngProgress.start();
        this._strategyproposalservice.SaveStrategyProposal(this.project.strategyProposal);

        setTimeout(() => {
            this.ngProgress.done();
            this._router.navigate(["/dashboard/strategyproposal"]);
        }, 1000);
        this._router.navigate(["/dashboard/strategyproposal"]);

    }

    cancel() {
        this._router.navigate(["/dashboard/strategyproposal"]);
    }

    get remarks() { return this.strategyProposalForm.get('remarks'); }
}