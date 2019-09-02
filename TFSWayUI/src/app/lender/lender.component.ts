import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NgProgress } from 'ngx-progressbar';
import { UserService } from '../service/user.service';
import { IUser } from '../loginform/user';
import 'rxjs/add/operator/switchMap';
import { ILender } from './lender';
import { LenderService } from '../service/lender.service';




@Component({
    selector: 'app-lender',
    templateUrl: 'app/lender/lender.component.html',
    styleUrls: ['app/lender/lender.component.css'],
    providers: [LenderService]

})


export class LenderComponent {


    public isAdmin: boolean = false;
    lenders: Array<ILender> = [];

    lenderForm: FormGroup;
    clientId: number = null;
    projectId: number = null;
    lender: ILender;
    activeuserdesignation: string;
    createdbyuser: string = null;
    createddate: string = new Date().toISOString().slice(0, 10);
    errorMessage: any;
    submitted: boolean = false;
    _ref: any;

    order: string = 'LenderName'; //set default
    reverse: boolean = false;
    editLender: boolean = false;


    constructor(private _lenderdervice: LenderService, private _location: Location, private http: Http, private _fb: FormBuilder,
        private _avRoute: ActivatedRoute,
        private _router: Router,
        public ngProgress: NgProgress, private _user: UserService) {

        this.activeuserdesignation = _user.Designation;
        this.projectId = _user.ActiveProjectId;
        this.createdbyuser = _user.userName;


        if (this._avRoute.snapshot.params["id"]) {
            this.clientId = parseInt(this._avRoute.snapshot.params["id"]);
        }

        this.lenderForm = this._fb.group({
            lenderId: 0,
            clientId: this.clientId,
            projectId: this.projectId,
            lenderName: (''),
            lenderAddress: (''),
            createdDate: this.createddate,
            createdBy: this.createdbyuser,
            updatedDate: this.createddate,
            updatedBy: this.createdbyuser

        })

        if (this.activeuserdesignation == "Supervisor")
            this.lenderForm.disable(true);

        this.getLenders();
    }


    getLenders() {
        //this.ngProgress.start();
        this._lenderdervice.getMasterLenders().subscribe((lenderdata) => {
            this.lenders = lenderdata;
        }
            , error => { this.errorMessage = error })
    }

    edit(lenderobj: ILender) {

        this.editLender = true;
        this.lenderForm.patchValue({ lenderId: lenderobj.lenderId });
        this.lenderForm.controls["lenderName"].setValue(lenderobj.lenderName);
        this.lenderForm.controls["lenderAddress"].setValue(lenderobj.lenderAddress);
        this.lenderForm.patchValue({ updatedDate: this.createddate });
        this.lenderForm.patchValue({ updatedBy: this.createdbyuser });

    }


    setactive(lenderobj: ILender) {
        if (this.activeuserdesignation != 'Supervisor') {
            var ans = confirm("Do you want to save Lender " + lenderobj.lenderName + " for the Client  ");

            if (ans) {
                lenderobj.clientId = this.clientId;
                lenderobj.projectId = this.projectId;
                lenderobj.createdDate = this.createddate;
                lenderobj.createdBy = this.createdbyuser;
                lenderobj.updatedDate = this.createddate;
                lenderobj.updatedBy = this.createdbyuser;
                this._lenderdervice.saveLender(lenderobj)

                setTimeout(() => {
                    this._location.back()
                }, 1000);
                this.editLender = false;
            }
        }
    }

    cancel() {
        this._location.back()
    }

    save() {

        if (!this.lenderForm.valid) {
            this.submitted = true;
            return;
        }


        this.ngProgress.start();
        if (this.editLender == true) {
            this._lenderdervice.updateLender(this.lenderForm.value);
        } else {
            this._lenderdervice.saveLender(this.lenderForm.value);
        }
        this.editLender = false;

        setTimeout(() => {
            this.ngProgress.done();
            this.getLenders();
        }, 1000);

        this.lenderForm.controls["lenderName"].setValue("");
        this.lenderForm.controls["lenderAddress"].setValue("");

    }

    setOrder(value: string) {
        if (this.order === value) {
            this.reverse = !this.reverse;
        }

        this.order = value;
    }

    get lenderName() { return this.lenderForm.get('lenderName'); }
    get lenderAddress() { return this.lenderForm.get('lenderAddress'); }

}  