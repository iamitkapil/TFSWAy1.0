import { Component ,OnInit} from '@angular/core';
import { ICustomer } from './customer';
import { Customerservice } from '../service/customer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { PagerService } from '../service/pager.service';

@Component({
  
    templateUrl: 'app/customer/customerlist.component.html',
    styleUrls: ['app/customer/customerlist.component.css'],
    providers: [Customerservice, PagerService]

})

export class CustomerListComponent implements OnInit {
    private isUploadBtn: boolean = true;
    customers: Array<ICustomer> = [];
    errorMessage: any;
    currentId: number = 0;
    serarchText: string = '';

    itemsperpage_json = [{ value: 2 }, { value: 5 }, { value: 10 }];
    itemsperpage: number = 10;

    // pager object
    pager: any = {};

    // paged items
    pagedItems: Array<ICustomer> = [];

    //sorting 
    order: string = 'customerFirstName'; //set default
    reverse: boolean = false;

    selectedcustomercountradiobutton: string = 'All';

    constructor(private _customerService: Customerservice,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        public ngProgress: NgProgress,
        private pagerService: PagerService, private http: Http) { }

    ngOnInit() {

        if (this._activatedRoute.snapshot.params["id"])
            this.currentId = parseInt(this._activatedRoute.snapshot.params["id"]);
       
        //setTimeout(()=>{
        //this.ngProgress.done();
        //}, 4000);    

        this.getCustomers();
    }

    getCustomers() {
        this.ngProgress.start();
        this._customerService.getCustomers().subscribe((Customerdata) => {
         this.customers = Customerdata;
         this.setPage(1);
         this.ngProgress.done()
       }                              
      , error => { this.errorMessage = error})
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        // get pager object from service
        this.pager = this.pagerService.getPager(this.customers.length, page, this.itemsperpage);

        // get current page of items
        this.pagedItems = this.customers.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    setItemsPerPage(items: number)
    {
        this.itemsperpage = items;
        //this.ngProgress.start();
        // this.setPage(items);
        // this.setPage(1);
        this.getCustomers();
    }


    setOrder(value: string) {
        if (this.order === value) {
            this.reverse = !this.reverse;
        }

        this.order = value;
    }



    trackbyCustID(index: number, customer: any): string {
        return customer.customerId;
    }

    add() {
     
        this._router.navigate(['/dashboard/customer/add']);
    }

    edit(id: number) {
     
        this._router.navigate(['/dashboard/customer/edit/' + id]);
     
    }

    delete(id: number) {
        var ans = confirm("Do you want to delete customer with Id: " + id);

        if (ans) {
            this._customerService.deleteCustomer(id)
                .subscribe(data => {

                    var index = this.customers.findIndex(x => x.customerId == id);
                    this.customers.splice(index, 1);
                    this.setPage(1);
                }, error => this.errorMessage = error)
           
        }

    }

    //upload 

    fileChange(event: any) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('uploadFile', file, file.name);
            let headers = new Headers()
            //headers.append('Content-Type', 'json');  
            //headers.append('Accept', 'application/json');  
            let options = new RequestOptions({ headers: headers });
            let apiUrl1 = "http://tfsapp1.westindia.cloudapp.azure.com/tfswebapi/api/fileupload/uploadjsonfile";
            this.http.post(apiUrl1, formData, options)
                .map(res => res.json())
                .catch(error => Observable.throw(error))
                .subscribe()

        }
        //window.location.reload();
    }
}