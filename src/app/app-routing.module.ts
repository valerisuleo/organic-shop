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
import { AuthGuard } from './services/auth-guard.service';
import { AdminAuthGuard } from './services/admin-auth-guard.service';

const routes: Routes = [
    // admin module
    { path: 'admin/products/edit/:id', component: AdminProductsEditComponent, canActivate: [AuthGuard, AdminAuthGuard] },
    { path: 'admin/products/new', component: AdminProductsNewComponent, canActivate: [AuthGuard, AdminAuthGuard] },
    { path: 'admin/products', component: AdminProductsComponent, canActivate: [AuthGuard, AdminAuthGuard] },
    { path: 'admin/orders', component: AdminOrdersComponent, canActivate: [AuthGuard, AdminAuthGuard] },
    // user module
    { path: 'order-success', component: OrderSuccessComponent, canActivate: [AuthGuard] },
    { path: 'check-out', component: CheckOutComponent, canActivate: [AuthGuard] },
    { path: 'shopping-carts', component: ShoppingCartComponent, canActivate: [AuthGuard] },
    { path: 'products', component: ProductsIndexComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: 'products' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }


