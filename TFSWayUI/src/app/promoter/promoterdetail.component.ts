import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { PromoterService } from '../service/promoter.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { IMyDpOptions, IMyDateModel, IMyInputFieldChanged } from 'mydatepicker';
import { UserService } from '../service/user.service';
import { IPromoter } from './promoter';

@Component({
    selector: 'app-promoterdetail',
    templateUrl: 'app/promoter/promoterdetail.component.html',
    styleUrls: ['app/promoter/promoterdetail.component.css'],
    providers: [PromoterService]

})


export class PromoterDetailComponent implements OnInit {

    private activeuserid: number;
    private activeuserdesignation: string;

    public myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd-mm-yyyy',
        height: '23px',
        showInputField: true,
        width: '160px'
    };

    currentuser: string = null;
    currentdate: string = new Date().toISOString().slice(0, 10);

    promoterForm: FormGroup;
    title: string = "Add";
    associationtype: string = "";
    promoterId: number = 0;
    projectId: number = 0;
    companyId: number = 0;
    errorMessage: any;
    submitted: boolean = false;
    _ref: any;

    //directors: Array<IDirector> = [];
    //authorisedpersons: Array<IAuthorisedPerson> = [];
    //shareholders: Array<IShareholder> = [];


    // start ***** for lookup
    public query = '';
    promoters: Array<IPromoter> = [];
    public filteredList: Array<IPromoter> = [];
    //End ***** for lookup

    constructor(private _fb: FormBuilder,
        private _avRoute: ActivatedRoute,
        private _promoterservice: PromoterService,
        private _router: Router,
        public ngProgress: NgProgress, private _user: UserService) {

        this.currentuser = _user.userName;
        this.activeuserdesignation = _user.Designation;
        this.activeuserid = _user.AuthorisedPersonId;
        this.projectId = _user.ActiveProjectId;
        this.companyId = _user.ActiveCompanyId;
        this.associationtype = "Promoter";

        if (this._avRoute.snapshot.params["id"]) {
            this.promoterId = parseInt(this._avRoute.snapshot.params["id"]);
            this.title = 'Edit';
        }



        this.promoterForm = this._fb.group({
            promoterId: 0,
            companyId: this.companyId,
            projectId: this.projectId,
            name: ['', [Validators.required]],
            changedName: (''),
            changedNameDate: (''),
            cin: (''),
            officeAddress: (''),
            pan: (''),
            incorporationDate: (''),
            isMainPromoter: 'No',
            chkPromoter: false,
            createdDate: this.currentdate,
            createdBy: this.currentuser,
            updatedDate: (''),
            updatedBy: ('')
        })

        if (this.activeuserdesignation == "Supervisor")
            this.promoterForm.disable(true);

    }

    ngOnInit() {

        this._promoterservice.getPromoters(0)
            .subscribe(resp => {
                this.promoters = resp;
            }
            , error => this.errorMessage = error);

        if (this.promoterId > 0) {

            this._promoterservice.getPromoterby(this.promoterId)
                .subscribe((resp) => {

                    if (resp.isMainPromoter == 'Yes')
                        resp.chkPromoter = true;
                    else
                        resp.chkPromoter = false;

                    this.promoterForm.setValue(resp);

                    this.promoterForm.patchValue({ updatedDate: this.currentdate });
                    this.promoterForm.patchValue({ updatedBy: this.currentuser });

                    if (resp.changedNameDate != null) {
                        let changednamedate = new Date(resp.changedNameDate);

                        this.promoterForm.patchValue({
                            changedNameDate: {
                                date: {
                                    year: changednamedate.getFullYear(),
                                    month: changednamedate.getMonth() + 1,
                                    day: changednamedate.getDate()
                                }
                            }
                        });
                    }

                    if (resp.incorporationDate != null) {
                        let incorporationdate = new Date(resp.incorporationDate);

                        this.promoterForm.patchValue({
                            incorporationDate: {
                                date: {
                                    year: incorporationdate.getFullYear(),
                                    month: incorporationdate.getMonth() + 1,
                                    day: incorporationdate.getDate()
                                }
                            }
                        });
                    }

                    //this._directorservice.getDirectors('Promoter', resp.promoterID)
                    //    .subscribe((resp) => {
                    //        this.directors = resp;
                    //    }
                    //    , error => this.errorMessage = error)

                    //this._authorisedpersonservice.getAuthorisedPersons()
                    //    .subscribe((resp) => {
                    //        this.authorisedpersons = resp;
                    //    }
                    //    , error => this.errorMessage = error)


                    //this._shareholderservice.getShareholders('Promoter', resp.promoterID)
                    //    .subscribe((resp) => {
                    //        this.shareholders = resp;
                    //    }
                    //    , error => this.errorMessage = error)

                }
                , error => this.errorMessage = error);

        }
    }

    save() {

        if (this.promoterId > 0) {
            let strincorporationDate = "";
            let strchangedNameDate = "";
            if (this.incorporationDate.value != null) {
                strincorporationDate = this.incorporationDate.value.date.year + '-' + this.incorporationDate.value.date.month + '-' + this.incorporationDate.value.date.day;
                this.incorporationDate.setValue(strincorporationDate);
            }
            if (this.changedNameDate.value != null) {
                strchangedNameDate = this.changedNameDate.value.date.year + '-' + this.changedNameDate.value.date.month + '-' + this.changedNameDate.value.date.day;
                this.changedNameDate.setValue(strchangedNameDate);
            }

        }
        else {
            if (this.incorporationDate.value != null) {
                this.incorporationDate.setValue(this.incorporationDate.value.formatted);
            }

            if (this.changedNameDate.value != null) {
                this.changedNameDate.setValue(this.changedNameDate.value.formatted);
            }
        }

        if (!this.promoterForm.valid) {
            this.submitted = true;
            return;
        }
        this.ngProgress.start();

        //console.log(this.promoterForm.value);
        this._promoterservice.savePromoter(this.promoterForm.value);
        setTimeout(() => {
            this.ngProgress.done();
            this._router.navigate(["/dashboard/promoter"]);
        }, 1000);

    }


    onCheckboxChange(ismainpromoter: any) {
        //var shareholder: IShareholder = null;
        this._promoterservice.getPromoters(this.companyId)
            .subscribe((promoterdata) => {
                var promoter = promoterdata.filter(p => p.isMainPromoter == "Yes")[0];
                if (ismainpromoter == true) {
                    if (promoter != null) {
                        var ans = confirm("Do you want to override Main Promoter: " + promoter.name + " ?");
                        ans ? this.isMainPromoter.setValue('Yes') : this.isMainPromoter.setValue('No');
                        if (ans) {
                            promoter.isMainPromoter = "No"
                            promoter.updatedDate = this.currentdate;
                            promoter.updatedBy = this.currentuser;
                            this._promoterservice.savePromoter(promoter);
                        }
                    }
                    else
                        this.isMainPromoter.setValue('Yes');
                }
                else
                    this.isMainPromoter.setValue('No');

            }
            , error => { this.errorMessage = error })
    }


    filter(event: any) {
        if (this.query !== "") {
            this.filteredList = this.promoters.filter(function (el: any) {
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

        let promoter = this.promoters.filter(ap => ap.name == item.name && ap.officeAddress == item.officeAddress);
        this.name.setValue(promoter[0].name);
        this.officeAddress.setValue(promoter[0].officeAddress);
        this.cin.setValue(promoter[0].cin);
        this.pan.setValue(promoter[0].pan);
        this.changedName.setValue(promoter[0].changedName);

        if (promoter[0].changedNameDate != null) {
            let changednamedate = new Date(promoter[0].changedNameDate);

            this.promoterForm.patchValue({
                changedNameDate: {
                    date: {
                        year: changednamedate.getFullYear(),
                        month: changednamedate.getMonth() + 1,
                        day: changednamedate.getDate()
                    }
                }
            });
        }

        if (promoter[0].incorporationDate != null) {
            let incorporationdate = new Date(promoter[0].incorporationDate);

            this.promoterForm.patchValue({
                incorporationDate: {
                    date: {
                        year: incorporationdate.getFullYear(),
                        month: incorporationdate.getMonth() + 1,
                        day: incorporationdate.getDate()
                    }
                }
            });
        }
     
    }

    addDirector(type: string, id: number) {

        this._router.navigate(['/dashboard/director/add/' + type + '/' + id]);
    }
    addAuthorizedPerson(type: string, id: number) {

        this._router.navigate(['/dashboard/authorizedperson/add/' + type + '/' + id]);
    }
    addShareholder(type: string, id: number) {

        this._router.navigate(['/dashboard/shareholder/add/' + type + '/' + id]);
    }

    onDateChanged(event: IMyDateModel) {

    }

    clearDate(): void {
        this.promoterForm.patchValue({ incorporationdate: null, changedNameDate: null });
    }

    cancel() {
        this._router.navigate(["/dashboard/promoter"]);
    }



    get name() { return this.promoterForm.get('name'); }
    get changedNameDate() { return this.promoterForm.get('changedNameDate'); }
    get cin() { return this.promoterForm.get('cin'); }
    get officeAddress() { return this.promoterForm.get('officeAddress'); }
    get incorporationDate() { return this.promoterForm.get('incorporationDate'); }
    get pan() { return this.promoterForm.get('pan'); }
    get isMainPromoter() { return this.promoterForm.get('isMainPromoter'); }
    get chkPromoter() { return this.promoterForm.get('chkPromoter'); }
    get changedName() { return this.promoterForm.get('changedName');  }



}