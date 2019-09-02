import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { UserService } from '../service/user.service'
import { IPromoter } from '../promoter/promoter';
import { IUser } from '../loginform/user';
import { IShareholder } from './shareholder';
import { ShareholderService } from '../service/shareholder.service';
import { PromoterService } from '../service/promoter.service';

@Component({
    selector: 'app-shareholder',
    templateUrl: 'app/shareholder/shareholder.component.html',
    styleUrls: ['app/shareholder/shareholder.component.css'],
    providers: [ShareholderService, PromoterService]

})


export class ShareholderComponent implements OnInit {

    showPromoters: boolean = false;

    promoters: Array<IPromoter> = [];

    shareholderForm: FormGroup;
    shareholdertype: string = '';
    companyId: number = 0;
    projectId: number = 0;
    shareholder: IShareholder;
    private activeuserdesignation: string;
    currentuser: string = null;
    currentdate: string = new Date().toISOString().slice(0, 10);
    shareholderId: number = null;
    title: string = "Add";
    errorMessage: any;
    submitted: boolean = false;
    _ref: any;

    // start ***** for lookup
    public query = '';
    shareholders: Array<IShareholder> = [];
    public filteredList: Array<IShareholder> = [];
    //End ***** for lookup

    constructor(private _shareholderservice: ShareholderService, private _location: Location,
        private http: Http, private _fb: FormBuilder,
        private _avRoute: ActivatedRoute,
        private _promoterservice: PromoterService,
        private _router: Router,
        private _user: UserService) {

        this.activeuserdesignation = _user.Designation;
        this.currentuser = _user.userName;
        this.projectId = _user.ActiveProjectId;
        this.companyId = _user.ActiveCompanyId;

        if (this._avRoute.snapshot.params["id"]) {
            this.shareholderId = parseInt(this._avRoute.snapshot.params["id"]);
            this.title = 'Edit';
        }

        this.shareholderForm = this._fb.group({
            shareholderId: 0,
            companyId: this.companyId,
            shareholderPromoterId: null,
            name: ['', [Validators.required]],
            share: ['', [ Validators.pattern("\\d*")]],
            faceValue: ['', [Validators.pattern("\\d*(\\.\\d{0,2})?")]],
            percentage: ['', [Validators.pattern("\\d*(\\.\\d{0,2})?")]],
            shareholderType: ['', [Validators.required]],
            isMainShareholder: 'No',
            //chkShareholder: false,
            createdDate: this.currentdate,
            createdBy: this.currentuser,
            updatedDate: null,
            updatedBy: null
        })

        if (this.activeuserdesignation == "Supervisor")
            this.shareholderForm.disable(true);
    }

    ngOnInit() {

        this._shareholderservice.getShareholders(0)
            .subscribe(resp => {
                this.shareholders = resp;
            }
            , error => this.errorMessage = error);

        if (this.shareholderId > 0) {
            this._shareholderservice.getShareholder(this.shareholderId)
                .subscribe((resp) => {
                    if (resp.shareholderType == 'Promoter')
                    {
                        this.showPromoters = true;
                        this.getpromoters(this.companyId);
                    }
                    else
                        this.showPromoters = false;
                    //if (resp.isMainShareholder == 'Yes')
                    //    resp.chkShareholder = true;
                    //else
                    //    resp.chkShareholder = false;
                    //console.log(resp);
                    this.shareholderForm.setValue(resp);

                    this.shareholderForm.patchValue({ updatedDate: this.currentdate });
                    this.shareholderForm.patchValue({ updatedBy: this.currentuser });

                }
                , error => this.errorMessage = error);

        }
    }

    onTypeChange(shareholdertype: string) {

        if (shareholdertype == 'Promoter') {
            this.showPromoters = true;
            this.getpromoters(this.companyId);
            this.shareholderPromoterId.setValidators([Validators.required]);
        }
        else {
            this.shareholderPromoterId.setValue('')
            this.showPromoters = false;
        }

    }
    cancel() {
        this._location.back();
    }

    save() {

        if (!this.shareholderForm.valid) {
            this.submitted = true;
            return;
        }

        this._shareholderservice.saveShareholder(this.shareholderForm.value);
        setTimeout(() => {
            this._location.back()
        }, 1000);

    }

    getpromoters(companyid: number) {
        this._promoterservice.getPromoters(companyid).subscribe((promoterdata) => {
            this.promoters = promoterdata;
        }
            , error => { this.errorMessage = error })

    }

    filter(event: any) {
        if (this.query !== "") {
            this.filteredList = this.shareholders.filter(function (el: any) {
                for (let property in el) {
                    if (el[property] === null) {
                        continue;
                    }
                    if (el[property].toString().toLowerCase().includes(this.query.toLowerCase())) {
                        return true;
                    }
                }
            }.bind(this));
            //if (event.code == "ArrowDown" && this.selectedIdx < this.filteredList.length) {
            //    this.selectedIdx++;
            //} else if (event.code == "ArrowUp" && this.selectedIdx > 0) {
            //    this.selectedIdx--;
            //}
        } else {
            this.filteredList = [];
        }
        // console.log("query=>" + this.query);
        // console.log("List=>" + this.filteredList);

    }

    select(item: any) {
        //this.query = item;
        this.filteredList = [];
        //this.selectedIdx = -1;

        let shareholder = this.shareholders.filter(ap => ap.name == item.name);
        this.name.setValue(shareholder[0].name);
        this.share.setValue(shareholder[0].share);
        this.faceValue.setValue(shareholder[0].faceValue);
        this.percentage.setValue(shareholder[0].percentage);
        
    }


    //onCheckboxChange(ismainshareholder: any) {
    //    //var shareholder: IShareholder = null;
    //    this._shareholderservice.getShareholders(this.companyId)
    //        .subscribe((shareholderdata) => {
    //            var shareholder = shareholderdata.filter((s => s.isMainShareholder == "Yes" && s.shareholderType == this.shareholderType.value))[0];
    //            if (ismainshareholder == true) {
    //                if (shareholder != null) {
    //                    var ans = confirm("Do you want to override Main Shareholder: " + shareholder.name + " ?");
    //                    ans ? this.isMainShareholder.setValue('Yes') : this.isMainShareholder.setValue('No');
    //                    if (ans) {
    //                        shareholder.isMainShareholder = "No"
    //                        shareholder.updatedDate = this.currentdate;
    //                        shareholder.updatedBy = this.currentuser;
    //                        this._shareholderservice.saveShareholder(shareholder);
    //                   }
    //               }
    //               else
    //                   this.isMainShareholder.setValue('Yes');
    //           }
    //           else
    //               this.isMainShareholder.setValue('No');

    //        }
    //        , error => { this.errorMessage = error })
    //}

    get shareholderType() { return this.shareholderForm.get('shareholderType'); }
    get shareholderPromoterId() { return this.shareholderForm.get('shareholderPromoterId'); }
    get name() { return this.shareholderForm.get('name'); }
    get share() { return this.shareholderForm.get('share'); }
    get faceValue() { return this.shareholderForm.get('faceValue'); }
    get percentage() { return this.shareholderForm.get('percentage'); }
    get isMainShareholder() { return this.shareholderForm.get('isMainShareholder'); }
    get chkShareholder() { return this.shareholderForm.get('chkShareholder'); }
}