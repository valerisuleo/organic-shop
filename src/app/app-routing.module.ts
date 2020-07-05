import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { LoginComponent } from './components/login/login.component';
import { ProductsIndexComponent } from './components/products/products-index/products-index.component';
import { CheckOutComponent } from './components/check-out/check-out.component';


const routes: Routes = [
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
