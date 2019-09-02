import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NgProgress } from 'ngx-progressbar';
import { UserService } from '../service/user.service'
import { IUser } from '../loginform/user';
import { IGroup } from './group';
import { GroupService } from '../service/group.service';

@Component({
    selector: 'app-group',
    templateUrl: 'app/group/group.component.html',
    styleUrls: ['app/group/group.component.css'],
    providers: [GroupService]
 })


export class GroupComponent implements OnInit{

    activeuserid: number;
    activeuserdesignation: string;

    currentuser: string = null;
    currentdate: string = new Date().toISOString().slice(0, 10);
    groupId: number = null;
   
    groupForm: FormGroup;
    title: string = "Add";
  
    errorMessage: string;
    submitted: boolean = false;
   

    constructor(private _groupservice: GroupService,
        private _location: Location, private http: Http,
        private _fb: FormBuilder,
        private _avRoute: ActivatedRoute,
        private _router: Router,
        public ngProgress: NgProgress, private _user: UserService) {

        this.activeuserdesignation = _user.Designation;       
        this.currentuser = _user.userName;

        if (this._avRoute.snapshot.params["id"]) {
            this.groupId = parseInt(this._avRoute.snapshot.params["id"]);
            this.title = 'Edit';
        }

       

        this.groupForm = this._fb.group({
            groupId: 0,
            companyId: 0,
//            projectId: 0,
            groupName: ['', [Validators.required]],
            companyName: ['', [Validators.required]],
            registeredAddress: ['', [Validators.required]],
            //siteAdress: (''),
            //projectName: ['', [Validators.required]],
            createdDate: this.currentdate,
            createdBy: this.currentuser,
            updatedDate: null,
            updatedBy: null
        })

        if (this.activeuserdesignation == "Supervisor")
            this.groupForm.disable(true);


    }

    ngOnInit() {
        if (this.groupId > 0) {

            this._groupservice.getGroup(this.groupId)
                .subscribe((resp) => {
                    console.log(resp);
                    this.groupForm.setValue(resp);
                    this.groupForm.patchValue({ updatedDate: this.currentdate });
                    this.groupForm.patchValue({ updatedBy: this.currentuser });

                }
                , error => this.errorMessage = error);

        }
    }

    save() {

         if (!this.groupForm.valid) {
            this.submitted = true;
            return;
        }

         this._groupservice.saveGroup(this.groupForm.value).
             subscribe(resp =>
             {
                 this.errorMessage = resp;
                 if (this.errorMessage.includes("Successfully"))
                 {
                     setTimeout(() => {
                         this._location.back()
                     }, 1000);
                 }
             }
         );
         


    }

    cancel() {
        this._location.back();
    }

    get groupName() { return this.groupForm.get('groupName'); }
    get companyName() { return this.groupForm.get('companyName'); }
    get registeredAddress() { return this.groupForm.get('registeredAddress'); }
    //get siteAdress() { return this.groupForm.get('siteAdress'); }
    //get projectName() { return this.groupForm.get('projectName'); }
    
}