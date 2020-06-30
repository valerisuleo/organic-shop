import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsIndexComponent } from './components/products/products-index/products-index.component';
import { ProductsShowComponent } from './components/products/products-show/products-show.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { LoginComponent } from './components/login/login.component';


const routes: Routes = [
    { path: 'shopping-carts', component: ShoppingCartComponent },
    { path: 'products/:id', component: ProductsShowComponent },
    { path: 'products', component: ProductsIndexComponent },
    { path: 'login', component: LoginComponent },
    // { path: '**', component: PathNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
