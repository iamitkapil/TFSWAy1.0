import { Injectable } from '@angular/core';
import { ICustomer } from '../customer/customer';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppConfig } from '../app.config';

@Injectable()
export class Customerservice {

    baseUrl: string = 'customer/'
    envURL: string = "";

    constructor(private _http: Http, private config: AppConfig) {

        this.envURL = config.getConfig('envURL');
        this.baseUrl = this.envURL + this.baseUrl;
    }
    //getCustomer(): ICustomer[] {
    //    return [
    //        { customerId: '1', customerFirstName: 'Ajay', customerLastName: 'Kushwaha' },
    //        { customerId: '2', customerFirstName: 'Mallika', customerLastName: 'Gupta' },
    //        { customerId: '3', customerFirstName: 'Gagan', customerLastName: 'Dhaliwal' },
    //        { customerId: '4', customerFirstName: 'dhiresh', customerLastName: 'atri' }

    //    ];
    //}

    getFirstNames(): Observable<string[]> {
        return this._http.get(this.baseUrl + 'GetCustomersFirstName')
            .map((response: Response) => <string[]>response.json())
            .catch(this._errorHandler);

    }

    getCustomers(): Observable<ICustomer[]> {
        return this._http.get(this.baseUrl + 'getcustomers')
            .map((response: Response) => <ICustomer[]>response.json())
            .catch(this._errorHandler);
    }

    getCustomerById(id: number) {
        return this._http.get(this.baseUrl + "GetCustomer/" + id)
            .map((response: Response) => <ICustomer>response.json()).catch(this._errorHandler)
    }


    saveCustomer(customer: ICustomer): Observable<any> {
        if (customer.customerId == null || customer.customerId == 0) {
            return this._http.post(this.baseUrl + 'PostCustomer', customer).map((response: Response) => response.json()).catch(this._errorHandler);
    
        } else {
            return this._http.put(this.baseUrl + 'UpdateCustomer', customer).map((response: Response) => response.json()).catch(this._errorHandler);
            
        }
    }

    //updateCustomert(customer: ICustomer) {
    //    return this._http.patch(this.baseUrl + 'UpdateCustomer', customer).map((response: Response) => response.json()).catch(this._errorHandler)
    //}

    deleteCustomer(id: number) {
        
        //return this._http.delete(this.baseUrl + "DeleteCustomer/" + id).map((response: Response) => response.json())
        //    .catch(this._errorHandler)
            return this._http.delete(this.baseUrl + "DeleteCustomer/" + id).catch(this._errorHandler)

    }



    _errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error || "Internal server error");
    }


    

}