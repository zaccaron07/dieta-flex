import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FoodPreferencesService {

  constructor(
    private afFirestore: AngularFirestore,
    private authService: AuthService
  ) {

  }

  public getFoodPreferences(): Observable<any[]> {
    return this.afFirestore.collection(`user/${this.authService.getUser().id}/food_preferences`)
      .snapshotChanges()
      .pipe(
        map(data => {
          return data.map(action => (
            { ...action.payload.doc.data(), id: action.payload.doc.id }
          ));
        })
      )
  }
}
