// modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// extra
import { environment } from '../environments/environment';
import { DataService } from './services/data.service';
import { AuthService } from './services/auth.service';
// components
import { AppComponent } from './app.component';
import { BootstrapNavbarComponent } from './components/bootstrap-navbar/bootstrap-navbar.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth-guard.service';
import { AdminAuthGuard } from './services/admin-auth-guard.service';
import { ShoppingModule } from './components/shopping.module';
import { SharedModule } from './shared.module';
import { AdminModule } from './components/admin/admin.module';


@NgModule({
    declarations: [
        AppComponent,
        BootstrapNavbarComponent,
        LoginComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAnalyticsModule,
        AngularFireAuthModule,
        FontAwesomeModule,
        SharedModule,
        ShoppingModule,
        NgbModule,
        AdminModule
    ],
    providers: [
        DataService,
        AuthService,
        AuthGuard,
        AdminAuthGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
