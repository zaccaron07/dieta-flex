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

  createHistoric(historicData: HistoricData, result) {
    let returnCreated;

    if (result.length > 0) {
      historicData.id = result[0]["id"]
    }

    if (historicData["id"]) {
      returnCreated = this.afFirestore.collection(`user/${this.authService.getUser().id}/historic`).doc(historicData["id"]).update(historicData)
    } else {
      returnCreated = this.afFirestore.collection(`user/${this.authService.getUser().id}/historic`).add(historicData);
    }

    return returnCreated;
  }

  documentExists(historicData): Observable<any> {
    return this.afFirestore.collection(`user/${this.authService.getUser().id}/historic`, ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;

      query = query.where("time", "==", historicData.time)

      return query
    })
      .snapshotChanges()
      .pipe(
        map(data => {
          return data.map(action => ({ ...action.payload.doc.data(), id: action.payload.doc.id }));
        })
      )
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
