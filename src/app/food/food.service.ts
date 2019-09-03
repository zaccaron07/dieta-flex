import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FoodData } from './food-data.model';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private afFirestore: AngularFirestore) { }

  createFood(foodData: FoodData) {
    let retorno;
    if (foodData["id"]) {
      retorno = this.afFirestore.collection('food').doc(foodData["id"]).update(foodData)
    } else {
      retorno = this.afFirestore.collection('food').add(foodData);
    }
    return retorno;
  }

  getFood(): Observable<FoodData[]> {
    return this.afFirestore.collection('food')
      .snapshotChanges()
      .pipe(
        map(data => {
          return data.map(action => (
            { ...action.payload.doc.data(), id: action.payload.doc.id } as FoodData
          ));
        }),
        take(1)
      )
  }

  deleteFood(idFood: string) {
    return this.afFirestore.collection(`food`).doc(idFood).delete();
  }
}
