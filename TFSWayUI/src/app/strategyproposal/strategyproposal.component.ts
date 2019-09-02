import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { IProject, IStrategyProposal } from './strategyproposal';
import { StrategyProposalservice } from '../service/strategyproposal.service';
import { NgProgress } from 'ngx-progressbar';
import { IMyDpOptions, IMyDateModel, IMyInputFieldChanged } from 'mydatepicker';
import { UserService } from '../service/user.service'
let saveAs = require('file-saver');


@Component({
    selector: 'app-strategyproposal',
    templateUrl: 'app/strategyproposal/strategyproposal.component.html',
    styleUrls: ['app/strategyproposal/strategyproposal.component.css'],
    providers: [StrategyProposalservice]
})


export class StrategyProposalComponent implements OnInit {

    private activeuserid: number;
    private activeuserdesignation: string;

    createdbyuser: string = null;
    createddate: string = new Date().toISOString().slice(0, 10);

    strategyproposalForm: FormGroup;
    title: string = "Add";
    projectId: number = 0;
    strategyproposalId = 0;
    errorMessage: any;
    submitted: boolean = false;
    project: IProject;

    constructor(private _fb: FormBuilder,
        private _avRoute: ActivatedRoute,
        private _strategyproposalservice: StrategyProposalservice ,
        private _router: Router,
        private ngProgress: NgProgress, private _user: UserService) {

        this.createdbyuser = _user.userName;
        this.activeuserdesignation = _user.Designation;
        this.projectId = _user.ActiveProjectId;



        if (this._avRoute.snapshot.params["id"]) {
            this.strategyproposalId = parseInt(this._avRoute.snapshot.params["id"]);
            console.log(this.strategyproposalId);
            this.title = 'Edit';
        }

        this.strategyproposalForm = this._fb.group({

            strategyProposalId: 0,
            projectId: this.projectId,
            ppaTerminationClause: ['', [Validators.required]],
            ppaLiquidatedDamages: ['', [Validators.required]],
            ppaPaymentmechanism: ['', [Validators.required]],
            ppaOthers: ['', [Validators.required]],
            experienceinRelSec: ['', [Validators.required]],
            financialStrenth: ['', [Validators.required]],
            indicativeEquityArrangement: ['', [Validators.required]],
            prevRelationwithLender: ['', [Validators.required]],
            tenure: ['', [Validators.required]],
            roi: ['', [Validators.required]],
            termsAndConditions: ['', [Validators.required]],
            powerFinCorp: ['', [Validators.required]],
            ruralElectrificationCorp: ['', [Validators.required]],
            policyCompOthers: ['', [Validators.required]],
            strategyAdopted: ['', [Validators.required]], 
            createdDate: this.createddate,
            createdBy: this.createdbyuser,
            updatedDate: this.createddate,
            updatedBy: this.createdbyuser

        })

    }

    ngOnInit()
    {
        if (this.strategyproposalId > 0) {

            this._strategyproposalservice.getStrategyProposal(this.strategyproposalId)
                .subscribe(resp => {
                    this.project = resp;
                    this.strategyproposalForm.setValue(resp.strategyProposal);
                    this.strategyproposalForm.patchValue({ updatedDate: this.createddate });
                    this.strategyproposalForm.patchValue({ updatedBy: this.createdbyuser });
                }
                , error => this.errorMessage = error);
        }

        else {
            this._strategyproposalservice.getnewStrategyProposal(this.projectId)
                .subscribe(resp => {
                    this.project = resp;
                    //this.strategyproposalForm.setValue(resp.strategyProposal);
                }
                , error => this.errorMessage = error);
        }


    }


    save() {

        if (!this.strategyproposalForm.valid) {
            this.submitted = true;
            return;
        }

        this.ngProgress.start();
        this._strategyproposalservice.SaveStrategyProposal(this.strategyproposalForm.value);

        setTimeout(() => {
            this.ngProgress.done();
            this._router.navigate(["/dashboard/strategyproposal"]);
        }, 1000);

    }
    public ExportToMSWord(): void {
        console.log('ExportToMSWord');
        var ExportGrid = document.getElementById('exportgrid').innerHTML;
        let blob = new Blob([ExportGrid], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });
        saveAs(blob, "StrategyProposal_" + this.projectId + ".doc");
    }

    cancel() {
        this._router.navigate(["/dashboard/strategyproposal"]);
    }

    get ppaTerminationClause() { return this.strategyproposalForm.get('ppaTerminationClause'); }
    get ppaLiquidatedDamages() { return this.strategyproposalForm.get('ppaLiquidatedDamages'); }
    get ppaPaymentmechanism() { return this.strategyproposalForm.get('ppaPaymentmechanism'); }
    get ppaOthers() { return this.strategyproposalForm.get('ppaOthers'); }
    get experienceinRelSec() { return this.strategyproposalForm.get('experienceinRelSec'); }
    get financialStrenth() { return this.strategyproposalForm.get('financialStrenth'); }
    get indicativeEquityArrangement() { return this.strategyproposalForm.get('indicativeEquityArrangement'); }
    get prevRelationwithLender() { return this.strategyproposalForm.get('prevRelationwithLender'); }
    get tenure() { return this.strategyproposalForm.get('tenure'); }
    get roi() { return this.strategyproposalForm.get('roi'); }
    get termsAndConditions() { return this.strategyproposalForm.get('termsAndConditions'); }
    get powerFinCorp() { return this.strategyproposalForm.get('powerFinCorp'); }
    get ruralElectrificationCorp() { return this.strategyproposalForm.get('ruralElectrificationCorp'); }
    get policyCompOthers() { return this.strategyproposalForm.get('policyCompOthers'); }
    get strategyAdopted() { return this.strategyproposalForm.get('strategyAdopted'); } 

}