import * as firebaseui from 'firebaseui';
import * as firebase from 'firebase/app';
import * as fsBatchedWrites from '../../batched-writes';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

    fbUI: firebaseui.auth.AuthUI;

    constructor(
        private angularFire: AngularFireAuth,
        private db: AngularFirestore,
        private router: Router,
        private route: ActivatedRoute,
        private zone: NgZone
    ) { }


    onLoginSuccess(data) {
        const { additionalUserInfo, user } = data;
        
        if (additionalUserInfo.isNewUser) {
            const newUser = {
                id: user.uid,
                email: user.email,
                isAdmin: false
            }
            fsBatchedWrites.default.create(this.db, 'users', user.uid, newUser);
        }
        this.zone.run(() => {
            const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
            this.router.navigate([returnUrl || '/products']);
        });
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

    ngOnDestroy(): void {
        this.fbUI.delete();
    }

}
