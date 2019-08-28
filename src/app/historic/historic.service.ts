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
    let returnCreate;

    historicData.time = new Date().toString();

    if (historicData["id"]) {
      returnCreate = this.afFirestore.collection(`user/${this.authService.getUser().id}/historic`).doc(historicData["id"]).update(historicData)
    } else {
      returnCreate = this.afFirestore.collection(`user/${this.authService.getUser().id}/historic`).add(historicData);
    }
    return returnCreate;
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
}
