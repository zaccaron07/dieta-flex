import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FoodData } from './food-data.model';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DietFood } from '../diet/diet-data.model';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  private baseFood: FoodData[]

  constructor(private afFirestore: AngularFirestore) {
    this.initializeBaseFood()
  }

  createFood(foodData: FoodData) {
    let retorno;
    if (foodData["id"]) {
      retorno = this.afFirestore.collection('food').doc(foodData["id"]).update(foodData)
    } else {
      retorno = this.afFirestore.collection('food').add(foodData);
    }
    return retorno;
  }

  async initializeBaseFood() {
    this.baseFood = await this.getFood().toPromise()
  }

  getBaseFood(foodId: string) {
    return this.baseFood.find(({ id }) => id == foodId)
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

  getFoodByType(type) {
    return this.afFirestore.collection('food', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;

      query = query.where('food_type', '==', type);

      return query;
    })
      .snapshotChanges()
      .pipe(
        map(data => {
          return data.map(action => (
            { id: action.payload.doc.id, ...action.payload.doc.data() } as DietFood
          ));
        }),
        take(1)
      )
  }

  deleteFood(idFood: string) {
    return this.afFirestore.collection(`food`).doc(idFood).delete();
  }
}
