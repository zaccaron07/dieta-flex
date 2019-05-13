import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthData } from './auth-data.model';
import { map } from "rxjs/operators";
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore'
import {  Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userCollection: AngularFirestoreCollection<any>;

  private user: AuthData;
  userChanged = new Subject<AuthData>();

  constructor(
    private afAuth: AngularFireAuth,
    private afFirestore: AngularFirestore
  ) {

    this.userCollection = this.afFirestore.collection('user');
  }

  createuser(user) {
    this.userCollection.add(user);
  }

  registerUser(authData: AuthData) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
        .then(userData => {
          resolve(userData);

          this.createuser(authData);
        },
          err => reject(err));
    });
  }

  login(authData: AuthData) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
        .then(userData => resolve(userData),
          err => reject(err));
    });
  }

  geAuth() {
    return this.afAuth.authState.pipe(
      map(auth => auth)
    )
  }

  private setUser(user: AuthData) {
    this.user = user;

    this.userChanged.next(this.user);
  }

  getUser(user: AuthData) {
    return this.user;
  }

  retrieveUser(userEmail: string) {
    this.afFirestore.collection('user', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if (userEmail) {
        query = query.where('email', '==', userEmail);
      }

      return query;
    })
      .valueChanges()
      .subscribe((user) => {
        let lUser = {} as AuthData;

        lUser.email = user[0]['email'];
        lUser.name = user[0]['name'];
        lUser.password = user[0]['password'];

        this.setUser(lUser);
      });
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      location.reload();
    });
  }
}
