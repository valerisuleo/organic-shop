import * as fsBatchedWrites from '../batched-writes';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { faLeaf, faShoppingCart, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'bootstrap-navbar',
    templateUrl: './bootstrap-navbar.component.html',
    styleUrls: ['./bootstrap-navbar.component.scss']
})
export class BootstrapNavbarComponent implements OnInit {

    public isLoggedIn: boolean;
    public counter: number;
    public faLeaf: IconDefinition = faLeaf;
    public faShoppingCart: IconDefinition = faShoppingCart;

    constructor(
        private db: AngularFirestore,
        private authService: AuthService,
        private service: DataService
    ) { }

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


    displayQuantity() {
        const uid = localStorage.getItem('uid');
        this.service.getItem('userBucket', uid).subscribe((response: any) => this.counter = response.items.length);
    }

    ngOnInit(): void {
        this.displayQuantity();
        this.checkUserStatusBeforeCreateBucket();

    }

}
