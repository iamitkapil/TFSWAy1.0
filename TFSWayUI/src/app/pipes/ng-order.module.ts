import { NgModule } from '@angular/core';
import { OrderPipe } from './ng-order.pipe';

@NgModule({
    declarations: [OrderPipe],
    exports: [OrderPipe]
})
export class OrderModule { }