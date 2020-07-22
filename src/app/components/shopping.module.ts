import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsIndexComponent } from './products-list/products-list.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { SharedModule } from '../shared.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
    ],
    exports: [
        ProductsIndexComponent,
        ShoppingCartComponent,
        CheckOutComponent,
        OrderSuccessComponent

    ],
    declarations: [
        ProductsIndexComponent,
        ShoppingCartComponent,
        CheckOutComponent,
        OrderSuccessComponent
    ],
    providers: [],
})
export class ShoppingModule { }
