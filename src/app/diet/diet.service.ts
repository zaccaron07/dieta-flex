import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UserProfileData } from '../user-profile/user-profile.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { FoodService } from '../food/food.service';
import { DietResult, DietAmount, DietData } from './diet-data.model';

@Injectable({
  providedIn: 'root'
})
export class DietService {

  private userProfile: UserProfileData;
  private result = [] as DietResult[];
  public dietAmount = {} as DietAmount;
  public resultO = new Subject<DietResult[]>();
  public resultOO = new Subject<DietAmount>();

  constructor(
    private foodService: FoodService,
    private authService: AuthService,
    private afFirestore: AngularFirestore
  ) {
    this.authService.userChanged.subscribe(user => {
      this.userProfile = user;
    });
  }

  generateDiet() {
    this.calcMinCalories();
  }

  private calcMinCalories() {
    this.result = [] as DietResult[];
    this.dietAmount = {} as DietAmount;
    this.resultO = new Subject<DietResult[]>();
    this.resultOO = new Subject<DietAmount>();

    let lMinCalories: number = 0;

    const MALE = 1;

    if (this.userProfile.gender == MALE) {
      lMinCalories = 66 + (13.7 * this.userProfile.weight) + (5 * this.userProfile.height) - (6.5 * this.userProfile.age);
    } else {
      lMinCalories = 655 + (9.6 * this.userProfile.weight) + (1.8 * this.userProfile.height) - (4.7 * this.userProfile.age);
    }

    switch (this.userProfile.exercise_intensity) {
      case 2:
        lMinCalories += 193;
        break;

      case 3:
        lMinCalories += 425;
        break;

      case 4:
        lMinCalories += 676;
        break;

      case 5:
        lMinCalories += 1159;
        break;
    }

    switch (this.userProfile.goal) {
      case 1:
        lMinCalories -= 348;
        break;

      case 2:
        lMinCalories -= 695;
        break;

      case 4:
        lMinCalories += 162;
        break;

      case 5:
        lMinCalories += 348;
        break;
    }
    console.log(lMinCalories)

    let lDayProtein;
    let lDayCarbohydrate;
    let lTotalCalorires;

    lDayProtein = this.userProfile.weight * 2;

    this.dietAmount.totalProtein = lDayProtein;

    lTotalCalorires = lDayProtein * 4;

    lTotalCalorires += this.userProfile.weight * 9;

    this.dietAmount.totalFat = this.userProfile.weight;

    lMinCalories = lMinCalories - lTotalCalorires;

    lDayCarbohydrate = lMinCalories / 4;
    this.dietAmount.totalCarbohydrate = lDayCarbohydrate;

    this.dietAmount.totalCalories = this.dietAmount.totalProtein * 4 + this.dietAmount.totalFat * 9 + this.dietAmount.totalCarbohydrate * 4;

    this.resultOO.next(this.dietAmount);
    this.resultOO.next(this.dietAmount);

    this.afFirestore.collection('food', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;

      query = query.where('food_type', '==', 2);

      return query;
    })
      .snapshotChanges()
      .pipe(
        map(data => {
          return data.map(action => ({ id: action.payload.doc.id, ...action.payload.doc.data() }));
        }),
        take(1)
      )
      .subscribe((food) => {
        let lRandom;
        let lFat;
        let lFood;
        let lProtein;
        let lAmountFood;
        let lCarbohydrates;
        let lResultMeal = {} as DietResult;

        lRandom = Math.floor(Math.random() * food.length);

        lFood = food[lRandom];

        lAmountFood = (100 * (0.2 * lDayProtein)) / lFood.protein;
        lProtein = (lAmountFood * lFood.protein) / 100;
        lCarbohydrates = (lAmountFood * lFood.carbohydrate) / 100;
        lFat = (lAmountFood * lFood.fat) / 100;

        lResultMeal.name = lFood.name;
        lResultMeal.amount = lAmountFood;
        lResultMeal.calorie = lFood.calorie;
        lResultMeal.fat = lFat;
        lResultMeal.protein = lProtein;
        lResultMeal.carbohydrate = lCarbohydrates;

        this.result.push(lResultMeal);
        this.resultO.next(this.result);
      });

    this.afFirestore.collection('food', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;

      query = query.where('food_type', '==', 1);

      return query;
    })
      .snapshotChanges()
      .pipe(
        map(data => {
          return data.map(action => ({ id: action.payload.doc.id, ...action.payload.doc.data() }));
        }),
        take(1)
      )
      .subscribe((food) => {
        let lRandom;
        let lFat;
        let lFood;
        let lProtein;
        let lCarbohydrates;
        let lAmountFood;
        let lResultMeal = {} as DietResult;

        lRandom = Math.floor(Math.random() * food.length);

        lFood = food[lRandom];

        lAmountFood = (100 * (0.15 * lDayCarbohydrate)) / lFood.carbohydrate;
        lProtein = (lAmountFood * lFood.protein) / 100;
        lCarbohydrates = (lAmountFood * lFood.carbohydrate) / 100;
        lFat = (lAmountFood * lFood.fat) / 100;

        lResultMeal.name = lFood.name;
        lResultMeal.amount = lAmountFood;
        lResultMeal.calorie = lFood.calorie;
        lResultMeal.fat = lFat;
        lResultMeal.protein = lProtein;
        lResultMeal.carbohydrate = lCarbohydrates;

        this.result.push(lResultMeal);
        this.resultO.next(this.result);
      });

    this.afFirestore.collection('food', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;

      query = query.where('food_type', '==', 0);

      return query;
    })
      .snapshotChanges()
      .pipe(
        map(data => {
          return data.map(action => ({ id: action.payload.doc.id, ...action.payload.doc.data() }));
        }),
        take(1)
      )
      .subscribe((food) => {
        let lRandom;
        let lFood;
        let lResultMeal = {} as DietResult;
        let lPrevious: number;

        lPrevious = 0;

        for (let index = 0; index < 2; index++) {
          lRandom = Math.floor(Math.random() * food.length);

          while (true) {
            let lR;

            lR = Math.floor(Math.random() * food.length);

            if (lR != lPrevious) {
              lRandom = lR;

              break;
            }
          }

          lFood = food[lRandom];

          lResultMeal.name = lFood.name;
          lResultMeal.amount = 1;
          lResultMeal.fat = lFood.fat;
          lResultMeal.calorie = lFood.calorie;
          lResultMeal.protein = lFood.protein;
          lResultMeal.carbohydrate = lFood.carbohydrate;
          lResultMeal.portion = true;

          this.result.push(JSON.parse(JSON.stringify(lResultMeal)));

          lPrevious = lRandom;
        }
        this.resultO.next(this.result)
      });
  }

  createDiet(diet) {
    if (diet["id"]) {
      return this.afFirestore.collection(`user/${this.authService.getUser().id}/diet`).doc(diet["id"]).update(diet)
    } else {
      return this.afFirestore.collection(`user/${this.authService.getUser().id}/diet`).add(diet);
    }
  }

  getDiet() {
    return this.afFirestore.collection<DietData>(`user/${this.authService.getUser().id}/diet`)
      .snapshotChanges()
      .pipe(
        map(data => {
          return data.map(action => ({ id: action.payload.doc.id, ...action.payload.doc.data() }));
        }),
        take(1)
      )
  }

  getDietByDate(date) {
    return this.afFirestore.collection(`user/${this.authService.getUser().id}/diet`, ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;

      query = query.where("date", "==", date)

      return query
    })
      .snapshotChanges()
      .pipe(
        map(data => {
          return data.map(action => ({ ...action.payload.doc.data(), id: action.payload.doc.id }));
        }),
        take(1)
      )
  }

  deleteDiet(dietId) {
    return this.afFirestore.collection(`user/${this.authService.getUser().id}/diet`).doc(dietId).delete();
  }
}