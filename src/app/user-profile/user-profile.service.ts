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

    return this.afFirestore.collection('user').doc(lUserId).update(userProfile);
  }

  getGoalDescriptionById(id: number) : string {

    let description: string;

    switch (id) {
      case 1:
        description = "Emagrecer"
        break

      case 2:
        description = "Emagrecer Agressivo"
        break

      case 3:
        description = "Manter"
        break

      case 4:
        description = "Ganhos “Secos”"
        break

      case 5:
        description = "Ganhos agressivos"
        break
    }
    return description;
  }

}
