// modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// extra
import { environment } from '../environments/environment';
import { DataService } from './services/data.service';
import { AuthService } from './services/auth.service';
// components
import { AppComponent } from './app.component';
import { ProductsIndexComponent } from './components/products/products-index/products-index.component';
import { BootstrapFormComponent } from './reusable-components/bootstrap-form/bootstrap-form.component';
import { BootstrapInputComponent } from './reusable-components/bootstrap-input/bootstrap-input.component';
import { BootstrapSelectComponent } from './reusable-components/bootstrap-select/bootstrap-select.component';
import { BootstrapListComponent } from './reusable-components/bootstrap-list/bootstrap-list.component';
import { BootstrapNavbarComponent } from './components/bootstrap-navbar/bootstrap-navbar.component';
import { BootstrapCardGroupComponent } from './reusable-components/bootstrap-card/bootstrap-card.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { LoginComponent } from './components/login/login.component';
import { PaginationComponent } from './reusable-components/pagination/pagination.component';
import { BootstrapTableComponent } from './reusable-components/bootstrap-table/bootstrap-table.component';
import { BootstrapAlertComponent } from './reusable-components/bootstrap-alert/bootstrap-alert.component';
import { CheckOutComponent } from './components/check-out/check-out.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';
import { AdminProductsComponent } from './components/admin/admin-products/admin-products.component';
import { FilterPipe } from './components/admin/filter.pipe';
import { AdminProductsEditComponent } from './components/admin/admin-products-edit/admin-products-edit.component';
import { AdminProductsNewComponent } from './components/admin/admin-products-new/admin-products-new.component';


@NgModule({
    declarations: [
        AppComponent,
        ProductsIndexComponent,
        BootstrapFormComponent,
        BootstrapInputComponent,
        BootstrapSelectComponent,
        BootstrapListComponent,
        BootstrapCardGroupComponent,
        BootstrapNavbarComponent,
        ShoppingCartComponent,
        LoginComponent,
        PaginationComponent,
        BootstrapTableComponent,
        BootstrapAlertComponent,
        CheckOutComponent,
        OrderSuccessComponent,
        AdminOrdersComponent,
        AdminProductsComponent,
        FilterPipe,
        AdminProductsEditComponent,
        AdminProductsNewComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAnalyticsModule,
        ReactiveFormsModule,
        NgbModule,
        AngularFireAuthModule,
        FontAwesomeModule,
        FormsModule
    ],
    providers: [
        DataService,
        AuthService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
