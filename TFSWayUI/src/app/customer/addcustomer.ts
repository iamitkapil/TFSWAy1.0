import { Component } from '@angular/core';
import { Customerservice } from '../service/customer.service';
import { ICustomer } from './customer';

@Component({
    templateUrl: 'app/customer/addcustomer.html',
    styles: [`Label{display:inline-block;
            width:140px;}
            input{width:250px;
                }
`]
})


export class addcustomer {

    
    //add(ID: string, firstname: string, lastname: string): void {
    //    ID = ID.trim();
    //    firstname = firstname.trim();
    //    lastname = lastname.trim();

    //    if (!ID) { return; }
    //    Customerservice. .add ({ ID, firstname, lastname } as Customer)
    //        .subscribe(customer => {
    //            this.customers.push(customer);
    //        });
    //}

    //constructor(private Customerservice: Customerservice){}

    //onAddcustomer(id, firstname, customerLastName): void {
    //    let customer: customer = { ID: id, customerFirstName: firstname, customerLastName: customerLastName };
    //    this.Customerservice.insertcustomer(customer);
    //}
}