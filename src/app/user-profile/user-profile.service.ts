import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserProfileData } from './user-profile.model';
import { HistoricData } from './historic.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private afFirestore: AngularFirestore, private authService: AuthService) { }

  createUserProfile(userProfile: UserProfileData) {
    let lUserId: string;
    let historic = {} as HistoricData;
    
    lUserId = this.authService.getUser().id;

    historic.height = userProfile.height;
    historic.weight = userProfile.weight;
    historic.time = new Date().toString();
    
    this.afFirestore.collection('user/'+ lUserId +'/historic').add(historic);
    
    return this.afFirestore.collection('user').doc(lUserId).update(userProfile);
  }
}