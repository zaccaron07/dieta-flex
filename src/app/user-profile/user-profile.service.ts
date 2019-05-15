import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserProfileData } from './user-profile.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private afFirestore: AngularFirestore, private authService: AuthService) { }

  createUserProfile(userProfile: UserProfileData) {
    let lUserId: string;

    lUserId = this.authService.getUser().id;
    this.afFirestore.collection('user').doc(lUserId).update(userProfile);
  }
}
