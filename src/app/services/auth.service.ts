import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {

    constructor(private angularFire: AngularFireAuth) { }

    getAuthState() {
        return this.angularFire.authState
        .pipe(
            map(data => data.toJSON())
        )
    }

    signOut() {
        return this.angularFire.auth.signOut();
    }

    isLoggedIn(): Observable<boolean> {
        return this.angularFire.authState
            .pipe(map(user => !!user))
    }
}