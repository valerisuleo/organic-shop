import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebaseui from 'firebaseui';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';


@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

    fbUI: firebaseui.auth.AuthUI;

    constructor(
        private angularFire: AngularFireAuth,
        private router: Router,
        private zone: NgZone
    ) { }


    onLoginSuccess(message) {
        console.log('message', message);
        this.zone.run(() => {
            this.router.navigate(['/products']);
        })
    }

    ngOnInit(): void {

        const uiConfig = {

            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID
            ],

            callbacks: {
                signInSuccessWithAuthResult: this.onLoginSuccess.bind(this)
            }

        };

        this.fbUI = new firebaseui.auth.AuthUI(this.angularFire.auth);

        this.fbUI.start('#firebaseui-auth-container', uiConfig);
    }

    ngOnDestroy() : void {
        this.fbUI.delete();
    }

}
