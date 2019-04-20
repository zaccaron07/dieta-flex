import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { AuthData } from './auth-data.model';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

  registerUser(authData: AuthData) {
    this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {

      })
      .catch(error => {
        console.log(error)
      })
  }

  login(authData: AuthData) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
        .then(userData => resolve(userData),
          err => reject(err));
    })
  }

  loginWithGoogle() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider);
  }

  geAuth(){
    return this.afAuth.authState.pipe(
      map(auth => auth)
    )
  }
}
