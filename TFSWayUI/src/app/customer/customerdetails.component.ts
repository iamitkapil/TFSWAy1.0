import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ClientService } from '../service/Client.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { PagerService } from '../service/pager.service';
import { UserService } from '../service/user.service'
import { LenderService } from '../service/lender.service'
import { ILender } from '../lender/lender'


@Component({
    selector: 'app-customerdetails',
    templateUrl: 'app/customer/customerdetails.component.html',
    styleUrls: ['app/customer/customerdetails.component.css'],
    providers: [ClientService, LenderService, PagerService]
})


export class CustomerDetailsComponent implements OnInit {


    private activeuserid: number;
    private activeuserdesignation: string;

    clientForm: FormGroup;
    private clientId: number = 0;
    projectId: number = 0;
    errorMessage: any;
    submitted: boolean = false;
    _ref: any;
    lenders: Array<ILender> = [];

    constructor(private _fb: FormBuilder,
        private _avRoute: ActivatedRoute,
        private _clientservice: ClientService,
        private _router: Router, private _lenderservice: LenderService,
        public ngProgress: NgProgress, private _user: UserService) {

        this.activeuserdesignation = _user.Designation;
        this.activeuserid = _user.AuthorisedPersonId;
        this.projectId = _user.ActiveProjectId;
       

        this.clientForm = this._fb.group({
            clientID: 0,
            projectID: 0,
            name: (''),
            designation: (''),
            contactNumber: (''),
            email: (''),
            //lender: (''),
            //lenderAddress: (''),
            assignedGM: (''),
            gmRegion: (''),
            assignedGMEmail: (''),
            assignedPO: (''),
            assignedPODesignation: (''),
            assignedPOContactNo: (''),
            assignedPOEmail: (''),
            assignedEO: (''),
            assignedEODesignation: (''),
            assignedEOContactNo: (''),
            assignedEOEmail: (''),
            assignedLO: (''),
            assignedLODesignation: (''),
            assignedLOContactNo: (''),
            assignedLOEmail: (''),
            leName: (''),
            leDesignation: (''),
            leContactNo: (''),
            leEmail: (''),
            lfaName: (''),
            lfaDesignation: (''),
            lfaContactNo: (''),
            lfaEmail: (''),
            liaName: (''),
            liaDesignation: (''),
            liaContactNo: (''),
            liaEmail: (''),
            llcName: (''),
            llcDesignation: (''),
            llcContactNo: (''),
            llcEmail: (''),
            createdDate: (''),
            createdBy: (''),
            updatedDate: (''),
            updatedBy: ('')

        })

        //console.log("projectId:" + this.projectId);

        if (this.activeuserdesignation == "Supervisor")
            this.clientForm.disable(true);
    }

    ngOnInit() {

        if (this.projectId > 0) {

            this._clientservice.getClientbyProjectId(this.projectId)
                .subscribe((resp) => {
                    this.clientId = resp.clientID;
                    this.clientForm.setValue(resp);
                    this._lenderservice.getLenders(resp.clientID)
                        .subscribe((resp) => {
                            this.lenders = resp;
                        }
                        , error => this.errorMessage = error)
                   
                }
                , error => this.errorMessage = error);

        }
       
    }


    save() {

        //debugger;

        console.log(this.clientId);

        if (!this.clientForm.valid) {

            this.submitted = true;

            return;

        }



        this.ngProgress.start();

        this._clientservice.saveClient(this.clientForm.value);

        ////setTimeout(()=>{
        ////this.ngProgress.done();
        ////}, 5000);

        setTimeout(() => {
            this.ngProgress.done();
            this._router.navigate(["/dashboard"]);
        }, 1000);


        //alert('Saved Successfully!')

        //this._router.navigate(["customerlist"]);

        // this._router.navigate(["customerlist", { id: this.customerId }]);

        //this._customerService.getCustomers();



    }

    cancel() {
        this._router.navigate(["/dashboard"]);
    }

    addLender(id: number) {

        this._router.navigate(['/dashboard/lender/add/' + id]);
    }
}