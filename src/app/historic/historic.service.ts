import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HistoricData } from '../user-profile/historic.model';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HistoricService {

  constructor(private afFirestore: AngularFirestore, private authService: AuthService) { }

  userId = this.authService.getUser().id;

  createHistoric(historicData: HistoricData) {
    let returnCreate;

    if (historicData["id"]) {
      returnCreate = this.afFirestore.collection(`user/${this.userId}/historic`).doc(historicData["id"]).update(historicData)
    } else {
      returnCreate = this.afFirestore.collection(`user/${this.userId}/historic`).add(historicData);
    }
    return returnCreate;
  }

  getHistoric() {
    return this.afFirestore.collection(`user/${this.userId}/historic`)
      .snapshotChanges()
      .pipe(
        map(data => {
          return data.map(action => ({ id: action.payload.doc.id, ...action.payload.doc.data() }));
        })
      )
  }
}
