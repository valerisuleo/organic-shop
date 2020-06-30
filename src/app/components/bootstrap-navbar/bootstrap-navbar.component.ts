import * as fsBatchedWrites from '../batched-writes';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import { ShoppingService } from '../../services/shopping.service';

@Component({
    selector: 'bootstrap-navbar',
    templateUrl: './bootstrap-navbar.component.html',
    styleUrls: ['./bootstrap-navbar.component.scss']
})
export class BootstrapNavbarComponent implements OnInit {

    isLoggedIn: boolean;
    counter: number;


    constructor(
        private shoppingService: ShoppingService, 
        private db: AngularFirestore, 
        private authService: AuthService) { }

    userBucket = {
        id: '',
        items: []
    }

    checkUserStatusBeforeCreateBucket(): void {
        this.authService.isLoggedIn()
            .subscribe((data) => {
                this.isLoggedIn = data;

                if (this.isLoggedIn) {
                    this.authService.getAuthState()
                        .subscribe((res: any) => {
                            const { uid } = res;
                            localStorage.setItem('uid', uid);
                            this.createUserBucket(uid);
                        });
                }
            });
    }

    createUserBucket(uid: string): void {
        this.db.doc(`/userBucket/${uid}`).valueChanges()
            .subscribe((response: any) => {
                if (!response) {
                    this.userBucket.id = uid;
                    fsBatchedWrites.default.create(this.db, 'userBucket', uid, this.userBucket);
                }
                else {
                    // console.log('bucker alreday on db', response);
                }
            });
    }

    logout() {
        this.authService.signOut();
    }


    fromProductIndex() {
        this.shoppingService.getData
            .subscribe((data: number) => {
                this.counter = data;
            });
    }

    ngOnInit(): void {
        this.checkUserStatusBeforeCreateBucket();
        this.fromProductIndex();

    }

}
