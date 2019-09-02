import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { UserService } from '../service/user.service'
import { IProject, ITeaser, IDirector, IShareholder } from './teaser';
import { Teaserservice } from '../service/teaser.service';
import { NgProgress } from 'ngx-progressbar';
let saveAs = require('file-saver');

@Component({
    selector: 'app-teaserview',
    templateUrl: 'app/teaser/teaserview.component.html',
    styleUrls: ['app/teaser/teaserview.component.css'],
    providers: [Teaserservice]
})


export class TeaserviewComponent implements OnInit {

    objProject: IProject = null;
    projectId: number = null;
    teaserid: number = null;
    activeuserdesignation: string;
    NoofTotalshares: number = 0;
    TotalShareCapital: number = 0;
    PercentageShare: number = 0;
    NoofOthersTotalShare: number = 0;
    TotalOthersShareCapital: number = 0;
    OthersPercentageShare: number = 0; 
    objOthers: Array<IShareholder> = [];
    objShareHolders: Array<IShareholder> = [];
    Teasersubmitted: boolean = false;
    teaserForm: FormGroup;
    updatedbyuser: string = null;
    updateddate: string = new Date().toISOString().slice(0, 10);

    errorMessage: any;

    
    constructor(private _fb: FormBuilder, private _teaserservice: Teaserservice,
        private _location: Location, private http: Http,
        private _avRoute: ActivatedRoute,
        private _router: Router,
        private _user: UserService,
        private ngProgress: NgProgress) {

        this.activeuserdesignation = _user.Designation;
        this.projectId = _user.ActiveProjectId;
        this.updatedbyuser = _user.userName;

        if (this._avRoute.snapshot.params["id"]) {
            this.teaserid = parseInt(this._avRoute.snapshot.params["id"]);
        }


        this.teaserForm = this._fb.group({

            remarks : ('')
        })

       // this.getTeaser();

       // console.log(this.teaser);
    }


    ngOnInit()
    {
        console.log(this.teaserid);
        this._teaserservice.getTeaser(this.teaserid).subscribe((resp) => {
            this.NoofTotalshares = resp.teaserModel.shareholders.reduce((sum, s) => sum + parseInt(s.noofShares), 0);
            this.TotalShareCapital = resp.teaserModel.shareholders.reduce((sum, s) => sum + (parseInt(s.noofShares) * parseInt(s.facevalue)), 0);
            this.PercentageShare = resp.teaserModel.shareholders.reduce((sum, s) => sum + (((parseInt(s.noofShares) * parseInt(s.facevalue)) / this.TotalShareCapital) * 100), 0);
            this.objProject = resp;
            this.objShareHolders = resp.teaserModel.shareholders.filter(s => s.shareholderType != "Others");
            this.objOthers = resp.teaserModel.shareholders.filter(s => s.shareholderType == "Others");
            this.NoofOthersTotalShare = this.objOthers.reduce((sum, s) => sum + parseInt(s.noofShares), 0);
            this.TotalOthersShareCapital = this.objOthers.reduce((sum, s) => sum + (parseInt(s.noofShares) * parseInt(s.facevalue)), 0);
            this.OthersPercentageShare = this.objOthers.reduce((sum, s) => sum + (((parseInt(s.noofShares) * parseInt(s.facevalue)) / this.TotalShareCapital) * 100), 0);
            this.Teasersubmitted = resp.teaserModel.teaser.status != "Created" ? true : false;
            if (this.Teasersubmitted) {
                this.remarks.setValue(resp.teaserModel.teaser.remarks);
                this.remarks.disable(true);
            }   
                
        }
            , error => { this.errorMessage = error })

        console.log(this.activeuserdesignation)

    }

    public ExportToMSWord(): void {
        console.log('ExportToMSWord');
        var ExportGrid = document.getElementById('exportgrid').innerHTML;
        let blob = new Blob([ExportGrid], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });
        saveAs(blob, "Teaser_" + this.projectId + ".doc");
    }

    save(status:string) {

        this.objProject.teaserModel.teaser.status = status;
        this.objProject.teaserModel.teaser.updatedDate = this.updateddate;
        this.objProject.teaserModel.teaser.updatedBy = this.updatedbyuser;
        this.objProject.teaserModel.teaser.remarks = this.remarks.value;
        this.ngProgress.start();
        this._teaserservice.SaveTeaser(this.objProject.teaserModel.teaser);

        setTimeout(() => {
            this.ngProgress.done();
            this._router.navigate(["/dashboard/teaser"]);
        }, 1000);
        //this._router.navigate(["/dashboard/teaser"]);

    }

    cancel() {
        this._router.navigate(["/dashboard/teaser"]);
    }

    get remarks() { return this.teaserForm.get('remarks'); }
}