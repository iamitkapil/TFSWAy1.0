import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NgProgress } from 'ngx-progressbar';
import { UserService } from '../service/user.service'
import { IPromoter } from '../promoter/promoter';
import { IUser } from '../loginform/user';
import { IDirector } from './director';
import { DirectorService } from '../service/director.service';
import { PromoterService } from '../service/promoter.service';


@Component({
    selector: 'app-director',
    templateUrl: 'app/director/director.component.html',
    styleUrls: ['app/director/director.component.css'],
    providers: [DirectorService, PromoterService]

})


export class DirectorComponent implements OnInit{

    showPromoters: boolean = false;

    promoters: Array<IPromoter> = [];

    directorForm: FormGroup;
    directortype: string = '';
    companyId: number = 0;
    projectId: number = 0;
    director: IDirector;
    private activeuserdesignation: string;
    currentuser: string = null;
    currentdate: string = new Date().toISOString().slice(0, 10);
    directorId: number = null;
    title: string = "Add";
    errorMessage: any;
    submitted: boolean = false;
    _ref: any;

    // start ***** for lookup
    public query = '';
    directors: Array<IDirector> = [];
    public filteredList: Array<IDirector> = [];
    //End ***** for lookup

    constructor(private _directorservice: DirectorService, private _location: Location, private http: Http, private _fb: FormBuilder,
        private _avRoute: ActivatedRoute,
        private _promoterservice: PromoterService,
        private _router: Router,
        public ngProgress: NgProgress, private _user: UserService) {

        this.activeuserdesignation = _user.Designation;
        this.currentuser = _user.userName;
        this.projectId = _user.ActiveProjectId;
        this.companyId = _user.ActiveCompanyId;


        if (this._avRoute.snapshot.params["id"]) {
            this.directorId = parseInt(this._avRoute.snapshot.params["id"]);
            this.title = 'Edit';
        }


        this.directorForm = this._fb.group({
            directorId: 0,
            companyId: this.companyId,
            directorPromoterId: null,
            name: ['', [Validators.required]],
            address: (''),
            din: (''),
            pan: (''),
            qualification: (''),
            expRelSector: (''),
            compSharehold: (''),
            directorType: ['', [Validators.required]],
            isMainDirector: 'No',
            //chkDirector: false,
            createdDate: this.currentdate,
            createdBy: this.currentuser,
            updatedDate: null,
            updatedBy: null
        })

        
        if (this.activeuserdesignation == "Supervisor")
            this.directorForm.disable(true);
    }

    ngOnInit() {

        this._directorservice.getDirectors(0)
            .subscribe(resp => {
                this.directors = resp;
            }
            , error => this.errorMessage = error);

        if (this.directorId > 0) {
            this.getpromoters(this.companyId);
            this._directorservice.getDirector(this.directorId)
                .subscribe((resp) => {
                    if (resp.directorType == 'Promoter')
                        this.showPromoters = true;
                    else
                        this.showPromoters = false;
                    //if (resp.isMainDirector == 'Yes')
                    //    resp.chkDirector = true;
                    //else
                    //    resp.chkDirector = false;
                    //console.log(resp);
                    this.directorForm.setValue(resp);
                    
                    this.directorForm.patchValue({ updatedDate: this.currentdate });
                    this.directorForm.patchValue({ updatedBy: this.currentuser });

                }
                , error => this.errorMessage = error);

        }
    }

    cancel() {
        this._location.back();
    }

    save() {

        if (!this.directorForm.valid) {
            this.submitted = true;
            return;
        }

        this._directorservice.saveDirector(this.directorForm.value);
        setTimeout(() => {
            this._location.back()
        }, 1000);

    }

    onChange(directortype: string) {

         this.directorPromoterId.setValue('');

        if (directortype == 'Promoter')
                {
                    this.showPromoters = true;
                    this.getpromoters(this.companyId);
                    this.directorPromoterId.setValidators([Validators.required]);
                }
            else{
                    this.showPromoters = false;
                }
           
        }

    getpromoters(companyid: number) {
        this._promoterservice.getPromoters(companyid).subscribe((promoterdata) => {
            this.promoters = promoterdata;
        }
            , error => { this.errorMessage = error })

    }

    //onCheckboxChange(ismaindirector: any) {
    //    if (ismaindirector == true)
    //        this.isMainDirector.setValue('Yes');
    //    else
    //        this.isMainDirector.setValue('No');

    //}

    filter(event: any) {
        if (this.query !== "") {
            this.filteredList = this.directors.filter(function (el: any) {
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

        let director = this.directors.filter(ap => ap.name == item.name && ap.address == item.address);
        this.name.setValue(director[0].name);
        this.address.setValue(director[0].address);
        this.din.setValue(director[0].din);
        this.pan.setValue(director[0].pan);
        this.qualification.setValue(director[0].qualification);
        this.expRelSector.setValue(director[0].expRelSector);
        this.compSharehold.setValue(director[0].compSharehold);
    }

    //onCheckboxChange(ismaindirector: any) {
    //    //var director: IDirector = null;
    //    this._directorservice.getDirectors(this.companyId)
    //        .subscribe((directordata) => {
    //            var director = directordata.filter((s => s.isMainDirector == "Yes" && s.directorType == this.directorType.value))[0];
    //            if (ismaindirector == true) {
    //                if (director != null) {
    //                    var ans = confirm("Do you want to override Main Director: " + director.name + " ?");
    //                    ans ? this.isMainDirector.setValue('Yes') : this.isMainDirector.setValue('No');
    //                    if (ans) {
    //                        director.isMainDirector = "No"
    //                        director.updatedDate = this.currentdate;
    //                        director.updatedBy = this.currentuser;
    //                        this._directorservice.saveDirector(director);
    //                    }
    //                }
    //                else
    //                    this.isMainDirector.setValue('Yes');
    //            }
    //            else
    //                this.isMainDirector.setValue('No');

    //        }
    //        , error => { this.errorMessage = error })
    //}

    get directorType() { return this.directorForm.get('directorType'); }
    get directorPromoterId() { return this.directorForm.get('directorPromoterId'); }
    get name() { return this.directorForm.get('name'); }
    get address() { return this.directorForm.get('address'); }
    get din() { return this.directorForm.get('din'); }
    get pan() { return this.directorForm.get('pan'); }
    get qualification() { return this.directorForm.get('qualification'); }
    get expRelSector() { return this.directorForm.get('expRelSector'); }
    get compSharehold() { return this.directorForm.get('compSharehold'); }
    //get isMainDirector() { return this.directorForm.get('isMainDirector'); }
    //get chkDirector() { return this.directorForm.get('chkDirector'); }

} 