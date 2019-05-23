import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FoodData } from './food-data.model';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private afFirestore: AngularFirestore) { }

  createFood(foodData: FoodData) {
    return this.afFirestore.collection('food').add(foodData);
  }
  getFood() {
    return this.afFirestore.collection('food').valueChanges();
  }
}
