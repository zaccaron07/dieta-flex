import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HistoricData } from '../user-profile/historic.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HistoricService {


  constructor(private afFirestore: AngularFirestore) { }

  createFood(foodData: HistoricData) {
    var retorno;
    if (foodData["id"]) {
      retorno = this.afFirestore.collection('historic').doc(foodData["id"]).update(foodData)
    } else {
      retorno = this.afFirestore.collection('historic').add(foodData);
    }
    return retorno;
  }

  getFood() {
    return this.afFirestore.collection('historic')
      .snapshotChanges()
      .pipe(
        map(data => {
          return data.map(action => ({ id: action.payload.doc.id, ...action.payload.doc.data() }));
        })
      )
  }}
