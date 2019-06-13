import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { UserProfileData } from '../user-profile/user-profile.model';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  contactChanged = new Subject<any[]>();
  contactsChanged = new Subject<any[]>();
  contacts = [];

  constructor(
    private afFirestore: AngularFirestore,
    private authService: AuthService
  ) { }

  retrieveContacts(userName: String) {
    let email;
    email = this.authService.getUser().email;

    return this.afFirestore.collection('user', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;

      if (userName) {
        query = query.orderBy('name').startAt(userName).endAt(userName + "\uf8ff")
      }

      return query;
    })
      .snapshotChanges()
      .pipe(
        map(data => {
          return data.map(action => ({ id: action.payload.doc.id, ...action.payload.doc.data() }));
        })
      )
      .subscribe((user) => {
        console.log(user)

        user = user.filter(user => user['email'] != email);

        console.log(user)
        this.contactChanged.next(user);
      });
  }

  addContact(contact) {
    let id;
    id = this.authService.getUser().id;
    console.log(id)
    this.afFirestore.collection('user').doc(id).collection('contacts').add(contact);
  }

  getContacts() {
    let id;
    id = this.authService.getUser().id;

    return this.afFirestore.collection(`user/${id}/contacts`, ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;

      return query;
    })
      .snapshotChanges()
      .pipe(
        map(data => {
          return data.map(action => ({ id: action.payload.doc.id, ...action.payload.doc.data() }));
        })
      )
      .subscribe((user) => {
        this.contactsChanged.next(user);
        this.contacts = user;
      });
  }
}
