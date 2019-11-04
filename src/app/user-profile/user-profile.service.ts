import { UserProfileGoalConst } from "./../diet/diet-rules/diet-constants"
import { Injectable } from "@angular/core"
import { AngularFirestore } from "@angular/fire/firestore"
import { UserProfileData } from "./user-profile.model"
import { AuthService } from "../auth/auth.service"

@Injectable({
  providedIn: "root"
})
export class UserProfileService {
  constructor(
    private afFirestore: AngularFirestore,
    private authService: AuthService
  ) {}

  createUserProfile(userProfile: UserProfileData) {
    let lUserId: string

    lUserId = this.authService.getUser().id

    return this.afFirestore
      .collection("user")
      .doc(lUserId)
      .update(userProfile)
  }

  isUserProfileConfigured() {
    let profileConfigured = false

    if (this.authService.getUser().gender) {
      profileConfigured = true
    }

    return profileConfigured
  }

  getGoalDescriptionById(id: number): string {
    let description: string

    switch (id) {
      case UserProfileGoalConst.AGGRESSIVE_WEIGHT_LOSS:
        description = "Emagrecer Agressivo"
        break

      case UserProfileGoalConst.LOSE_WEIGHT:
        description = "Emagrecer"
        break

      case UserProfileGoalConst.KEEP:
        description = "Manter"
        break

      case UserProfileGoalConst.DRY_EARNINGS:
        description = "Ganhos “Secos”"
        break

      case UserProfileGoalConst.AGGRESSIVE_GAINS:
        description = "Ganhos agressivos"
        break
    }
    return description
  }
}
