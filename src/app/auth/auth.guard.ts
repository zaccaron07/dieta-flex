import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private afAuthService: AuthService
    ) { }

    canActivate(): Observable<boolean> {
        return new Observable<boolean>((observer) => {
            this.afAuthService.getAuth().subscribe(auth => {
                if (!auth) {
                    this.router.navigate(['/login'])
                    observer.next(true)
                    observer.complete()
                    return false
                } else {
                    this.afAuthService.retrieveUser(auth.email)
                        .subscribe((user) => {
                            this.afAuthService.setUser(user[0])
                            observer.next(true)
                            observer.complete()
                            return true;
                        })
                }
            })
        })
    }
}