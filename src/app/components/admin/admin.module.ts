import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { AdminProductsEditComponent } from './admin-products-edit/admin-products-edit.component';
import { AdminProductsNewComponent } from './admin-products-new/admin-products-new.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FilterPipe } from './filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../services/auth-guard.service';
import { AdminAuthGuard } from '../../services/admin-auth-guard.service';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forChild([
            {
                path: 'products/edit/:id',
                component: AdminProductsEditComponent,
                canActivate: [AuthGuard, AdminAuthGuard]
            },
            {
                path: 'products/new',
                component: AdminProductsNewComponent,
                canActivate: [AuthGuard, AdminAuthGuard]
            },
            {
                path: 'products',
                component: AdminProductsComponent,
                canActivate: [AuthGuard, AdminAuthGuard]
            },
            {
                path: 'orders',
                component: AdminOrdersComponent,
                canActivate: [AuthGuard, AdminAuthGuard]
            },
        ])
    ],
    exports: [
        AdminOrdersComponent,
        AdminProductsComponent,
        AdminProductsEditComponent,
        AdminProductsNewComponent,
        FilterPipe,
    ],
    declarations: [
        AdminOrdersComponent,
        AdminProductsComponent,
        AdminProductsEditComponent,
        AdminProductsNewComponent,
        FilterPipe
    ],
    providers: [],
})
export class AdminModule { }
