import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UserProfileData } from '../user-profile/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class NewDietService {

  private userProfile: UserProfileData;

  constructor(
    private authService: AuthService
  ) {
    this.authService.userChanged.subscribe(user => {
      this.userProfile = user;
    });
  }

  generateDiet() {
    this.calcMinCalories();
  }

  private calcMinCalories() {

    let lMinCalories: number = 0;

    const MALE = 1;
    
    if (this.userProfile.gender == MALE) {
      lMinCalories = 66 + (13.7 * this.userProfile.weight) + (5 * this.userProfile.height) - (6.5 * this.userProfile.age);
    } else {
      lMinCalories = 655 + (9.6 * this.userProfile.weight) + (1.8 * this.userProfile.height) - (4.7 * this.userProfile.age);
    }
    console.log(this.userProfile)
    console.log(lMinCalories)
    switch (this.userProfile.exercise_intensity) {
      case 2:
        lMinCalories += 193;
        break;

      case 3:
        lMinCalories += 425;
        break;

      case 4:
        lMinCalories += 676;
        break;

      case 5:
        lMinCalories += 1159;
        break;
    }
    console.log(lMinCalories)
    switch (this.userProfile.goal) {
      case 1:
        lMinCalories -= 348;
        break;

      case 2:
        lMinCalories -= 695;
        break;

      case 4:
        lMinCalories += 162;
        break;

      case 5:
        lMinCalories += 348;
        break;
    }
    console.log(lMinCalories)
  }
}
