import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HistoricData } from '../historic/historic.model';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoricService {

  constructor(private afFirestore: AngularFirestore, private authService: AuthService) { }

  idUser = this.authService.getUser().id;

  createHistoric(historicData: HistoricData) {
    let lDate;
    let returnCreated;

    lDate = new Date();
    lDate = (lDate.getDay() > 9 ? lDate.getDay(): '0' + lDate.getDay()) + "/" + (lDate.getMonth() > 9 ? lDate.getMonth(): '0' + lDate.getMonth()) + "/" + lDate.getFullYear();
    historicData.time = lDate;

    if (historicData["id"]) {
      returnCreated = this.afFirestore.collection(`user/${this.authService.getUser().id}/historic`).doc(historicData["id"]).update(historicData)
    } else {
      returnCreated = this.afFirestore.collection(`user/${this.authService.getUser().id}/historic`).add(historicData);
    }
    return returnCreated;
  }

  getHistoric(): Observable<HistoricData[]> {

    return this.afFirestore.collection(`user/${this.idUser}/historic`)
      .snapshotChanges()
      .pipe(
        map(data => {
          return data.map(action => (
            { ...action.payload.doc.data(), id: action.payload.doc.id } as HistoricData
          ));
        })
      )
  }

  deleteHistoric(idHistoric: string) {
    return this.afFirestore.collection(`user/${this.idUser}/historic`).doc(idHistoric).delete();
  }
}
