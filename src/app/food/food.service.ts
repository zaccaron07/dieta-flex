import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FoodData } from './food-data.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private afFirestore: AngularFirestore) { }

  createFood(foodData: FoodData) {
    if (foodData["id"]) {
      return this.afFirestore.collection('food').doc(foodData["id"]).update(foodData)
    } else {
      return this.afFirestore.collection('food').add(foodData);
    }
  }

  getFood() {
    return this.afFirestore.collection('food')
      .snapshotChanges()
      .pipe(
        map(data => {
          return data.map(action => ({ id: action.payload.doc.id, ...action.payload.doc.data() }));
        })
      )
  }
}
