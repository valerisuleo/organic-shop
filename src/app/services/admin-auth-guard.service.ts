import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { async } from '@angular/core/testing';

@Injectable()
export class AdminAuthGuard implements CanActivate {

    constructor(
        private service: AuthService,
        private router: Router
    ) { }

    canActivate(route, state: RouterStateSnapshot): Observable<boolean> | boolean {

        return this.service.getCurrentUser()
            .pipe(
                map((response) => {
                    if (response) {
                        return true;
                    } else {
                        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } })
                        return false;
                    }
                })
            )
    }
}

