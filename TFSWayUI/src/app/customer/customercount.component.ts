import { Component, Input, Output,EventEmitter } from '@angular/core';


@Component({
    selector: 'count-customer',
    templateUrl: 'app/customer/customercount.component.html',
    styleUrls: ['app/customer/customercount.component.css']

})


export class CustomerCountComponent {


    selectedradiobuttonvale: string = 'ALL';

    @Output()
    countselectedchanged: EventEmitter<string> = new EventEmitter<string>(); 

    @Input()
    all: number;

    @Input()
    two: number;

    onrbselectionchnaged() {
        this.countselectedchanged.emit(this.selectedradiobuttonvale);
        console.log(this.selectedradiobuttonvale);
    }

}