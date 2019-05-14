import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserProfileData } from './user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private afFirestore: AngularFirestore) { }

  createUserProfile(userProfile: UserProfileData){
    return this.afFirestore.collection('user').add(userProfile);
  }
}
