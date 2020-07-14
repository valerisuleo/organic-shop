import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { LoginComponent } from './components/login/login.component';
import { ProductsIndexComponent } from './components/products/products-index/products-index.component';
import { CheckOutComponent } from './components/check-out/check-out.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';
import { AdminProductsComponent } from './components/admin/admin-products/admin-products.component';
import { AdminProductsEditComponent } from './components/admin/admin-products-edit/admin-products-edit.component';
import { AdminProductsNewComponent } from './components/admin/admin-products-new/admin-products-new.component';

const routes: Routes = [
    // admin module
    { path: 'admin/products/edit/:id', component: AdminProductsEditComponent },
    { path: 'admin/products/new', component: AdminProductsNewComponent },
    { path: 'admin/products', component: AdminProductsComponent },
    { path: 'admin/orders', component: AdminOrdersComponent },
    // user module
    { path: 'order-success', component: OrderSuccessComponent },
    { path: 'check-out', component: CheckOutComponent },
    { path: 'shopping-carts', component: ShoppingCartComponent },
    { path: 'products', component: ProductsIndexComponent },
    { path: 'login', component: LoginComponent },
    // { path: '**', component: PathNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
