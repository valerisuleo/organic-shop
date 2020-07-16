import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private service: AuthService, private router: Router) { }

    canActivate(route, state: RouterStateSnapshot): Observable<boolean> | boolean {
        return this.service.isLoggedIn()
            .pipe(
                map((res) => {
                    if (res) {
                        return true;
                    } else {
                        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } })
                        return false;
                    }
                })
            )
    }
}

