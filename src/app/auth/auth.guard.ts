import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private afAuth: AngularFireAuth,
        private afAuthService: AuthService
    ) { }

    canActivate(): Observable<boolean> {
        return this.afAuth.authState.pipe(
            map(auth => {
                if (!auth) {
                    this.router.navigate(['/login'])

                    return false;
                } else {
                    this.afAuthService.retrieveUser(auth.email);

                    return true;
                }
            })
        )
    }
}