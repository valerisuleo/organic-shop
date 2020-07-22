import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BootstrapAlertComponent } from './reusable-components/bootstrap-alert/bootstrap-alert.component';
import { BootstrapCardGroupComponent } from './reusable-components/bootstrap-card/bootstrap-card.component';
import { BootstrapFormComponent } from './reusable-components/bootstrap-form/bootstrap-form.component';
import { BootstrapInputComponent } from './reusable-components/bootstrap-input/bootstrap-input.component';
import { BootstrapListComponent } from './reusable-components/bootstrap-list/bootstrap-list.component';
import { BootstrapSelectComponent } from './reusable-components/bootstrap-select/bootstrap-select.component';
import { BootstrapTableComponent } from './reusable-components/bootstrap-table/bootstrap-table.component';
import { PaginationComponent } from './reusable-components/pagination/pagination.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbModule
    ],
    exports: [
        BootstrapAlertComponent,
        BootstrapCardGroupComponent,
        BootstrapAlertComponent,
        BootstrapFormComponent,
        BootstrapInputComponent,
        BootstrapListComponent,
        BootstrapSelectComponent,
        BootstrapTableComponent,
        PaginationComponent
    ],
    declarations: [
        BootstrapAlertComponent,
        BootstrapCardGroupComponent,
        BootstrapAlertComponent,
        BootstrapFormComponent,
        BootstrapInputComponent,
        BootstrapListComponent,
        BootstrapSelectComponent,
        BootstrapTableComponent,
        PaginationComponent
    ],
    providers: [],
})
export class SharedModule { }
