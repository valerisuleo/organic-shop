import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { LoginComponent } from './components/login/login.component';
import { ProductsIndexComponent } from './components/products/products-index/products-index.component';
import { CheckOutComponent } from './components/check-out/check-out.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
    // admin module
    {
        path: 'admin', 
        loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule)
    },
    // shopping module
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


