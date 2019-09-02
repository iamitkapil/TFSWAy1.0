import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { ICustomer } from './customer';
import { Customerservice } from '../service/customer.service';
import { ElementRef } from '@angular/core';



@Component({
    selector: 'app-customer',
    host: {
        '(document:click)': 'handleClick($event)',
    },
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.css'],
    providers: [Customerservice]
})

export class CustomerComponent implements OnInit {
    customerForm: FormGroup;
    title: string = "Add";
    customerId: number = 0;

    errorMessage: any;

    Message: string;
    submitted: boolean = false;


    public query = '';
    public customerslist: Array<ICustomer>=[]
    public FirstnameList : Array<string>=[];
    public filteredList: Array<ICustomer >= [];
    public elementRef: any;
    selectedIdx: number;




    _ref: any;

    constructor(private _fb: FormBuilder,
        private _avRoute: ActivatedRoute,

        private _customerService: Customerservice,

        private _router: Router,
        myElement: ElementRef) {

        this.elementRef = myElement;
        this.selectedIdx = -1;

        if (this._avRoute.snapshot.params["id"]) {

            this.customerId = parseInt(this._avRoute.snapshot.params["id"]);
            this.title = 'Edit';

        }

        this.customerForm = this._fb.group({
            customerId: 0,
            customerFirstName: ['', [Validators.required]],
            customerLastName: ['', [Validators.required]],
            customerPhone: ['', [Validators.required, Validators.pattern("[1-9][0-9]{9}")]],
            customerEmail: ['', [Validators.required]],
            customerDateofBirth: ['', [Validators.required]] // Validators.maxLength(10), Validators.pattern('^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/[0-9]{4}$')]]
        })
    }
    // we will use it to load data for update
    ngOnInit() {

        //this._customerService.getFirstNames()
        //    .subscribe(resp => { this.FirstnameList = resp; }
        //    , error => this.errorMessage = error);

        this._customerService.getCustomers()
            .subscribe(resp => {
                this.customerslist = resp;
            }
            , error => this.errorMessage = error);

        if (this.customerId > 0) {

            this._customerService.getCustomerById(this.customerId)
                .subscribe(resp => this.customerForm.setValue(resp)
                , error => this.errorMessage = error);

        }

    }

    save() {

        //debugger;

        if (!this.customerForm.valid) {

            this.submitted = true;

            return;

        }

        this._customerService.saveCustomer(this.customerForm.value)
            .subscribe(resp => {
            });

        setTimeout(() => {
            this._router.navigate(["/dashboard/customerlist"]);
        }, 2000);
    }



    cancel() {
        this._router.navigate(["/dashboard/customerlist", { id: this.customerId }]);
    }

    filter(event: any) {
        if (this.query !== "") {
            this.filteredList = this.customerslist.filter(function (el: any) {
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
    }

    select(item:any) {
        //this.query = item;
        this.filteredList = [];
        //this.selectedIdx = -1;

        let customer = this.customerslist.filter(c => c.customerFirstName == item.customerFirstName);
        this.customerFirstName.setValue(customer[0].customerFirstName);
        this.customerLastName.setValue(customer[0].customerLastName);
        this.customerPhone.setValue(customer[0].customerPhone);
        this.customerDateofBirth.setValue(customer[0].customerDateofBirth);
        this.customerEmail.setValue(customer[0].customerEmail);

    }

    handleClick(event:any) {
        var clickedComponent = event.target;
        var inside = false;
        do {
            if (clickedComponent === this.elementRef.nativeElement) {
                inside = true;
            }
            clickedComponent = clickedComponent.parentNode;
        } while (clickedComponent);
        if (!inside) {
            this.filteredList = [];
        }
        this.selectedIdx = -1;
    }

    //handleBlur() {
    //    if (this.selectedIdx > -1) {
    //        this.query = this.filteredList[this.selectedIdx];
    //    }
    //    this.filteredList = [];
    //    this.selectedIdx = -1;
    //}

    




    get customerFirstName() { return this.customerForm.get('customerFirstName'); }

    get customerLastName() { return this.customerForm.get('customerLastName'); }

    get customerPhone() { return this.customerForm.get('customerPhone'); }

    get customerEmail() { return this.customerForm.get('customerEmail'); }

    get customerDateofBirth() { return this.customerForm.get('customerDateofBirth'); }


}