import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NgProgress } from 'ngx-progressbar';
import { UserService } from '../service/user.service';
import { IUser } from '../loginform/user';
import 'rxjs/add/operator/switchMap';
import { IAgency } from './agency';
import { AgencyType } from './agency'
import { AgencyService } from '../service/agency.service';

@Component({
    selector: 'app-agency',
    templateUrl: 'app/agency/agency.component.html',
    styleUrls: ['app/agency/agency.component.css'],
    providers: [AgencyService]
 })


export class AgencyComponent implements OnInit {

    agencytype=AgencyType;
 
    keys :Array<string> = [];
   
   
    agencyForm: FormGroup;
    authorisedperson: IAgency;
    private activeuserdesignation: string;
    currentuser: string = null;
    currentdate: string = new Date().toISOString().slice(0, 10);
    errorMessage: any;
    submitted: boolean = false;
    agencyId: number = null;
    title: string = "Add";

    constructor(private _agencyservice: AgencyService,
        private _location: Location, private http: Http, private _fb: FormBuilder,
        private _avRoute: ActivatedRoute,
        private _router: Router,
        public ngProgress: NgProgress, private _user: UserService) {

        this.activeuserdesignation = _user.Designation;
        this.currentuser = _user.userName;
        this.keys = Object.keys(this.agencytype).filter(Number);
        //console.log(this.agencytype);

        if (this._avRoute.snapshot.params["id"]) {
            this.agencyId = parseInt(this._avRoute.snapshot.params["id"]);
            this.title = 'Edit';
        }

        this.agencyForm = this._fb.group({
            agencyId: 0,
            agencyType: ['', [Validators.required]],
            agencyName: ['', [Validators.required]],
            agencyAddress: ['', [Validators.required]],
            createdDate: this.currentdate,
            createdBy: this.currentuser,
            updatedDate: null,
            updatedBy: null
        })

        if (this.activeuserdesignation == "Supervisor")
            this.agencyForm.disable(true);


    }

    ngOnInit() {
        if (this.agencyId > 0) {

            this._agencyservice.getAgency(this.agencyId)
                .subscribe((resp) => {
                    console.log(resp);
                    this.agencyForm.setValue(resp);
                    this.agencyForm.patchValue({ updatedDate: this.currentdate });
                    this.agencyForm.patchValue({ updatedBy: this.currentuser });

                }
                , error => this.errorMessage = error);

        }
    }


    save() {

        // this.director = this.prepareSaveDirector();

        if (!this.agencyForm.valid) {
            this.submitted = true;
            return;
        }

        this._agencyservice.saveAgency(this.agencyForm.value);

       setTimeout(() => {
           this._location.back()
       }, 1000);

    }

    cancel() {
        this._location.back();
    }

    get agencyType() { return this.agencyForm.get('agencyType'); }
    get agencyName() { return this.agencyForm.get('agencyName'); }
    get agencyAddress() { return this.agencyForm.get('agencyAddress'); }
    
}