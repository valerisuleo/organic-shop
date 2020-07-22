import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Observable, forkJoin, combineLatest } from 'rxjs';
import { DataService } from './data.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { result, lowerFirst } from 'lodash';
import { IUser } from './interfaces';

@Injectable()
export class AuthService {

    constructor(
        private angularFire: AngularFireAuth,
        private service: DataService,
    ) { }

    public getAuthState() {
        return this.angularFire.authState
            .pipe(
                map((data) => {
                    if (data) {
                        return data.toJSON();
                    }
                })
            )
    }

    public signOut() {
        return this.angularFire.auth.signOut();
    }

    public isLoggedIn(): Observable<boolean> {
        return this.angularFire.authState
            .pipe(map(user => !!user))
    }

    public getCurrentUser(): Observable<boolean> {
        return combineLatest([
            this.getAuthState(),
            this.service.getAll('users')
        ])
            .pipe(
                map((response: any) => {
                    const users: IUser[] = response[1];
                    const credentials: any = response[0];
                    const current: IUser = users.find(obj => obj.id === credentials.uid);
                    return current.isAdmin;
                })
            )
    }
}