import * as fsBatchedWrites from '../../batched-writes';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { faLeaf, faShoppingCart, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
    selector: 'bootstrap-navbar',
    templateUrl: './bootstrap-navbar.component.html',
    styleUrls: ['./bootstrap-navbar.component.scss']
})
export class BootstrapNavbarComponent implements OnInit {

    public isOpen: boolean;
    public isLoggedIn: boolean;
    public isAdmin: boolean;
    public displayName: string;
    public counter: number;
    public userBucket = { id: '', items: [] };
    public faLeaf: IconDefinition = faLeaf;
    public faShoppingCart: IconDefinition = faShoppingCart;

    constructor(
        private db: AngularFirestore,
        private authService: AuthService,
        private service: DataService,
        private router: Router,
    ) { }

    public checkUserStatusBeforeCreateBucket(): void {
        this.authService.isLoggedIn()
            .subscribe((data) => {
                this.isLoggedIn = data;

                if (this.isLoggedIn) {
                    this.getRole();
                    this.authService.getAuthState()
                        .subscribe((res: any) => {
                            const { uid, displayName } = res;
                            this.displayName = displayName;
                            localStorage.setItem('uid', uid);
                            this.createUserBucket(uid);
                            this.displayQuantity(uid);
                        });
                }
            });
    }

    public createUserBucket(uid: string): void {
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

    public getRole(): void {
        this.authService.getCurrentUser().subscribe((response: boolean) => this.isAdmin = response);
    }

    public logout(): void {
        this.authService.signOut();
        localStorage.clear();
        this.router.navigate(['/login']);
    }

    public displayQuantity(uid): void {
        this.service.getItem('userBucket', uid).subscribe((response: any) => this.counter = response?.items.length);
    }

    public ngOnInit(): void {
        this.checkUserStatusBeforeCreateBucket();
    }

}