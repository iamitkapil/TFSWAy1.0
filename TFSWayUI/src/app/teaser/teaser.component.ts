import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { IProject, ITeaser, IDirector, IShareholder } from './teaser';
import { Teaserservice } from '../service/teaser.service';
import { NgProgress } from 'ngx-progressbar';
import { IMyDpOptions, IMyDateModel, IMyInputFieldChanged } from 'mydatepicker';
import { UserService } from '../service/user.service'
let saveAs = require('file-saver');

@Component({
    selector: 'app-teaser',
    templateUrl: 'app/teaser/teaser.component.html',
    styleUrls: ['app/teaser/teaser.component.css'],
    providers: [Teaserservice]
})


export class TeaserComponent implements OnInit {

    private activeuserid: number;
    private activeuserdesignation: string;

    createdbyuser: string = null;
    createddate: string = new Date().toISOString().slice(0, 10);

    teaserForm: FormGroup;
    title: string = "Add";
    projectId: number = 0;
    teaserId: number = 0;
    NoofTotalshares: number = 0;
    TotalShareCapital: number = 0;
    PercentageShare: number = 0;
    NoofOthersTotalShare: number = 0;
    TotalOthersShareCapital: number = 0;
    OthersPercentageShare: number = 0;
    projectUnit: string = "";
    projecttariffunit: string = "";

    errorMessage: any;
    submitted: boolean = false;
    objProject: IProject;
    objOthers: Array<IShareholder> = [];
    objShareHolders: Array<IShareholder> = [];


    constructor(private _fb: FormBuilder,
        private _avRoute: ActivatedRoute,
        private _teaserservice: Teaserservice,
        private _router: Router,
        private ngProgress: NgProgress, private _user: UserService) {

        this.createdbyuser = _user.userName;
        this.activeuserdesignation = _user.Designation;
        this.projectId = _user.ActiveProjectId;


        if (this._avRoute.snapshot.params["id"]) {
            this.teaserId = parseInt(this._avRoute.snapshot.params["id"]);
            console.log(this.teaserId);
            this.title = 'Edit';
        }

        this.teaserForm = this._fb.group({

            teaserId: 0,
            promoterId: 0,
            projectId: this.projectId,
            //promotername: (''),
            group: (''),
            promoterDescription: ['', [Validators.required]],
            expectedROI: ['', [Validators.required]],
            sellingArrangement: ['', [Validators.required]],
            powerEvacuation: ['', [Validators.required]],
            proposedSecurity: ['', [Validators.required]],
            request: ['', [Validators.required]],
            status: null,
            remarks: null,
            //promoter: null,
            //directors: (''),
            //shareholders: (''),
            createdDate: this.createddate,
            createdBy: this.createdbyuser,
            updatedDate: this.createddate,
            updatedBy: this.createdbyuser
        })


    }

    ngOnInit() {
        if (this.teaserId > 0) {

            this._teaserservice.getTeaser(this.teaserId)
                .subscribe(resp => {
                    this.NoofTotalshares = resp.teaserModel.shareholders.reduce((sum, s) => sum + parseInt(s.noofShares), 0);
                    this.TotalShareCapital = resp.teaserModel.shareholders.reduce((sum, s) => sum + (parseInt(s.noofShares) * parseInt(s.facevalue)), 0);
                    this.PercentageShare = resp.teaserModel.shareholders.reduce((sum, s) => sum + (((parseInt(s.noofShares) * parseInt(s.facevalue)) / this.TotalShareCapital) * 100), 0);
                    this.objProject = resp;
                    this.objShareHolders = resp.teaserModel.shareholders.filter(s => s.shareholderType != "Others");
                    this.objOthers = resp.teaserModel.shareholders.filter(s => s.shareholderType == "Others");
                    this.NoofOthersTotalShare = this.objOthers.reduce((sum, s) => sum + parseInt(s.noofShares), 0);
                    this.TotalOthersShareCapital = this.objOthers.reduce((sum, s) => sum + (parseInt(s.noofShares) * parseInt(s.facevalue)), 0);
                    this.OthersPercentageShare = this.objOthers.reduce((sum, s) => sum + (((parseInt(s.noofShares) * parseInt(s.facevalue)) / this.TotalShareCapital) * 100), 0);
                    this.teaserForm.setValue(resp.teaserModel.teaser);
                    this.teaserForm.patchValue({ group: resp.groupName });
                    this.teaserForm.patchValue({ updatedDate: this.createddate });
                    this.teaserForm.patchValue({ updatedBy: this.createdbyuser });
                }
                , error => this.errorMessage = error);
        }
        else {
            this._teaserservice.getnewTeaser(this.projectId)
                .subscribe(resp => {
                    this.promoterId.setValue(resp.teaserModel.promoter.promoterId);
                    this.NoofTotalshares = resp.teaserModel.shareholders.reduce((sum, s) => sum + parseInt(s.noofShares), 0);
                    this.TotalShareCapital = resp.teaserModel.shareholders.reduce((sum, s) => sum + (parseInt(s.noofShares) * parseInt(s.facevalue)), 0);
                    this.PercentageShare = resp.teaserModel.shareholders.reduce((sum, s) => sum + (((parseInt(s.noofShares) * parseInt(s.facevalue)) / this.TotalShareCapital) * 100), 0);
                    this.objProject = resp;
                    this.objShareHolders = resp.teaserModel.shareholders.filter(s => s.shareholderType != "Others");
                    this.objOthers = resp.teaserModel.shareholders.filter(s => s.shareholderType == "Others");
                    this.NoofOthersTotalShare = this.objOthers.reduce((sum, s) => sum + parseInt(s.noofShares), 0);
                    this.TotalOthersShareCapital = this.objOthers.reduce((sum, s) => sum + (parseInt(s.noofShares) * parseInt(s.facevalue)), 0);
                    this.OthersPercentageShare = this.objOthers.reduce((sum, s) => sum + (((parseInt(s.noofShares) * parseInt(s.facevalue)) / this.TotalShareCapital) * 100), 0);
                    this.teaserForm.patchValue({ group: resp.groupName });
                }
                , error => this.errorMessage = error);
        }

    }

    save() {

        if (!this.teaserForm.valid) {
            this.submitted = true;
            return;
        }

        this.ngProgress.start();

        this._teaserservice.SaveTeaser(this.teaserForm.value);

        setTimeout(() => {
            this.ngProgress.done();
            this._router.navigate(["/dashboard/teaser"]);
        }, 1000);

    }

    public ExportToMSWord(): void {
        console.log('ExportToMSWord');
        var ExportGrid = document.getElementById('exportgrid').innerHTML;
        let blob = new Blob([ExportGrid], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });
        saveAs(blob, "Teaser_" + this.projectId + ".doc");
    }

    cancel() {
        this._router.navigate(["/dashboard/teaser"]);
    }

    get promoterId() { return this.teaserForm.get('promoterId'); }
    get group() { return this.teaserForm.get('group'); }
    get promoterDescription() { return this.teaserForm.get('promoterDescription'); }
    get expectedROI() { return this.teaserForm.get('expectedROI'); }
    get sellingArrangement() { return this.teaserForm.get('sellingArrangement'); }
    get powerEvacuation() { return this.teaserForm.get('powerEvacuation'); }
    get proposedSecurity() { return this.teaserForm.get('proposedSecurity'); }
    get request() { return this.teaserForm.get('request'); }


}