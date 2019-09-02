import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NgProgress } from 'ngx-progressbar';
import { UserService } from '../service/user.service'
import { IUser } from '../loginform/user';
import { IAuthorisedPerson } from './authorisedperson';
import { IPromoter } from '../promoter/promoter';
import { IAgency } from '../agency/agency';
import { AgencyType } from './authorisedperson'
import { AuthorisedPersonService } from '../service/authorisedperson.service';
import { AgencyService } from '../service/agency.service';
import { PromoterService } from '../service/promoter.service';
import { TextMaskModule } from 'angular2-text-mask';


@Component({
    selector: 'app-authorizedperson',
    templateUrl: 'app/authorizedperson/authorizedperson.component.html',
    styleUrls: ['app/authorizedperson/authorizedperson.component.css'],
    providers: [AuthorisedPersonService, PromoterService, AgencyService]
})


export class AuthorizedPersonComponent implements OnInit {

    public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

    agencytype = AgencyType;
    showPromoters: boolean = false;
    showAgencys: boolean = false;

    keys: Array<string> = [];
    promoters: Array<IPromoter> = [];
    agencys: Array<IAgency> = [];
    filteredagencys: Array<IAgency> = [];
    agencysname: Array<string> = [];
    public query = '';
    authorisedpersons: Array<IAuthorisedPerson> = [];
    public filteredList: Array<IAuthorisedPerson> = [];

    authorisedpersontype: string = '';
    companyId: number = null;
    projectId: number = null;
    agencyId: number = null;
    authorisedpersonForm: FormGroup;
    authorisedperson: IAuthorisedPerson;
    private activeuserdesignation: string;
    currentuser: string = null;
    currentdate: string = new Date().toISOString().slice(0, 10);
    errorMessage: any;
    title: string = "Add";
    submitted: boolean = false;
    authorisedpersonId: number = null;

    constructor(private _authorisedpersonservice: AuthorisedPersonService,
        private _location: Location, private http: Http, private _fb: FormBuilder,
        private _avRoute: ActivatedRoute,
        private _promoterservice: PromoterService,
        private _agencyservice: AgencyService,
        private _router: Router,
        public ngProgress: NgProgress, private _user: UserService) {

        this.activeuserdesignation = _user.Designation;
        this.currentuser = _user.userName;
        this.projectId = _user.ActiveProjectId;
        this.companyId = _user.ActiveCompanyId;
        this.keys = Object.keys(this.agencytype).filter(Number);

        if (this._avRoute.snapshot.params["id"]) {
            this.authorisedpersonId = parseInt(this._avRoute.snapshot.params["id"]);
            this.title = 'Edit';
        }


        this.authorisedpersonForm = this._fb.group({
            authorisedPersonId: 0,
            companyId: this.companyId,
            authorisedPersonPromoterId: null,
            agencyType: ['', [Validators.required]],
            agencyName: (''),
            authorisedPersonAgencyId: null,
            agencyAddress: (''),
            name: ['', [Validators.required]],
            role: (''),
            contactNumber: (''),
            landlineNumber: (''),
            email: (''),
            isCoordinator: 'No',
            chkCoordinator: false,
            createdDate: this.currentdate,
            createdBy: this.currentuser,
            updatedDate: null,
            updatedBy: null
        })

        if (this.activeuserdesignation == "Supervisor")
            this.authorisedpersonForm.disable(true);


    }


    ngOnInit() {

        this._authorisedpersonservice.getAuthorisedPersons(0)
            .subscribe(resp => {
                this.authorisedpersons = resp;
            }
            , error => this.errorMessage = error);

        if (this.authorisedpersonId > 0) {
            this._authorisedpersonservice.getAuthorisedPerson(this.authorisedpersonId)
                .subscribe((resp) => {

                    switch (resp.agencyType) {

                        case AgencyType[AgencyType.Promoter]:
                            {
                                this.showPromoters = true;
                                this.showAgencys = false;
                                this.getpromoters(this.companyId);
                                this.authorisedPersonPromoterId.setValidators([Validators.required]);
                                break;
                            }
                        case AgencyType[AgencyType.Company]:
                            {
                                this.showAgencys = false;
                                this.showPromoters = false;
                                break;
                            }
                        default:
                            {
                                this.showAgencys = true;
                                this.showPromoters = false;
                                this.getagencys(resp.agencyType);
                                this.fillagencyaddress(resp.agencyType, resp.agencyName);
                                this.agencyName.setValidators([Validators.required]);
                                this.authorisedPersonAgencyId.setValidators([Validators.required]);
                                break;
                            }
                    }

                    if (resp.isCoordinator == 'Yes')
                        resp.chkCoordinator = true;
                    else
                        resp.chkCoordinator = false;
                    resp.updatedDate = this.currentdate;
                    resp.updatedBy = this.currentuser;
                    this.authorisedpersonForm.setValue(resp);

                    //this.authorisedpersonForm.patchValue({ updatedDate: this.currentdate });
                    //this.authorisedpersonForm.patchValue({ updatedBy: this.currentuser });
                }
                , error => this.errorMessage = error);

        }
    }




    save() {

        // this.director = this.prepareSaveDirector();

        if (!this.authorisedpersonForm.valid) {
            this.submitted = true;
            return;
        }

        this._authorisedpersonservice.saveAuthorisedPerson(this.authorisedpersonForm.value);

        setTimeout(() => {
            this._location.back()
        }, 1000);

    }

    cancel() {
        this._location.back();
    }

    onChange(agencytype: string) {

        this.agencyName.setValue('');
        this.authorisedPersonAgencyId.setValue('');

        switch (agencytype) {

            case AgencyType[AgencyType.Promoter]:
                {
                    this.showPromoters = true;
                    this.showAgencys = false;
                    this.getpromoters(this.companyId);
                    this.authorisedPersonPromoterId.setValidators([Validators.required]);
                    break;
                }
            case AgencyType[AgencyType.Company]:
                {
                    this.showAgencys = false;
                    this.showPromoters = false;
                    break;
                }
            default:
                {
                    this.showAgencys = true;
                    this.showPromoters = false;
                    this.getagencys(agencytype);
                    this.agencyName.setValidators([Validators.required]);
                    this.authorisedPersonAgencyId.setValidators([Validators.required]);
                    break;
                }
        }
    }

    onPromoterChange(promoterid: number)
    {
        let promoter = this.promoters.filter(p => p.promoterId == promoterid);
        this.name.setValue(promoter[0].name);
    }
    fillagencyaddress(agencytype: string, agencyname: string) {
        this._agencyservice.getAgencysByType(agencytype).subscribe((agencydata) => {
            this.filteredagencys = agencydata.filter(a => a.agencyName == agencyname);
        }
            , error => { this.errorMessage = error })
    }

    onAgencyChange(agencyname: string) {
        this.filteredagencys = this.agencys.filter(a => a.agencyName == agencyname);
    }


    getpromoters(companyid: number) {
        this._promoterservice.getPromoters(companyid).subscribe((promoterdata) => {
            this.promoters = promoterdata;
        }
            , error => { this.errorMessage = error })

    }

    getagencys(agencytype: string) {
        this._agencyservice.getAgencysByType(agencytype).subscribe((agencydata) => {
            this.agencys = agencydata;
            this.agencysname = agencydata.map(u => u.agencyName)
                .reduce((uniquearr, currentitem) => {
                    if (uniquearr.length === 0 || uniquearr[uniquearr.length - 1] !== currentitem) {
                        uniquearr.push(currentitem);
                    }
                    return uniquearr;
                }, []);
        }
            , error => { this.errorMessage = error })
    }

    onCheckboxChange(iscoordinator: any) {
        if (iscoordinator == true)
            this.isCoordinator.setValue('Yes');
        else
            this.isCoordinator.setValue('No');

    }

    filter(event: any) {
        if (this.query !== "") {
            this.filteredList = this.authorisedpersons.filter(function (el: any) {
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

        let authorisedPerson = this.authorisedpersons.filter(ap => ap.name == item.name && ap.contactNumber == item.contactNumber);
        this.name.setValue(authorisedPerson[0].name);
        this.role.setValue(authorisedPerson[0].role);
        this.contactNumber.setValue(authorisedPerson[0].contactNumber);
        this.landlineNumber.setValue(authorisedPerson[0].landlineNumber);
        this.email.setValue(authorisedPerson[0].email);
        

    }


    get agencyType() { return this.authorisedpersonForm.get('agencyType'); }
    get agencyName() { return this.authorisedpersonForm.get('agencyName') }
    get authorisedPersonPromoterId() { return this.authorisedpersonForm.get('authorisedPersonPromoterId') }
    get name() { return this.authorisedpersonForm.get('name'); }
    get role() { return this.authorisedpersonForm.get('role'); }
    get contactNumber() { return this.authorisedpersonForm.get('contactNumber'); }
    get email() { return this.authorisedpersonForm.get('email'); }
    get landlineNumber() { return this.authorisedpersonForm.get('landlineNumber'); }
    get authorisedPersonAgencyId() { return this.authorisedpersonForm.get('authorisedPersonAgencyId'); }
    get isCoordinator() { return this.authorisedpersonForm.get('isCoordinator'); }


}