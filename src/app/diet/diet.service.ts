import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UserProfileData } from '../user-profile/user-profile.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
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

  constructor(
    private foodService: FoodService,
    private authService: AuthService,
    private afFirestore: AngularFirestore
  ) { }

  generateDiet() {
    this.calcMinCalories();
  }

  private calcMinCalories() {
    this.result = [] as DietResult[];
    this.dietAmount = {} as DietAmount;
    this.resultO = new Subject<DietResult[]>();

    this.userProfile = this.authService.getUser()

    let lBasalMetabolicRate: number = 0;
    let lCaloricDayBalance: number = 0;
    let lIntensityExercise: number = 0;
    let lGoal: number = 0;

    const MALE = 1;

    if (this.userProfile.gender == MALE) {
      lBasalMetabolicRate = (10 * this.userProfile.weight) + (6.25 * this.userProfile.height) - (5 * this.userProfile.age) + 5;
    } else {
      lBasalMetabolicRate = (10 * this.userProfile.weight) + (6.25 * this.userProfile.height) - (5 * this.userProfile.age) - 161;
    }

    switch (this.userProfile.exercise_intensity) {
      case 2:
        lIntensityExercise += 193;
        break;

      case 3:
        lIntensityExercise += 425;
        break;

      case 4:
        lIntensityExercise += 676;
        break;

      case 5:
        lIntensityExercise += 1159;
        break;
    }

    switch (this.userProfile.goal) {
      case 1:
        lGoal -= 348;
        break;

      case 2:
        lGoal -= 695;
        break;

      case 4:
        lGoal += 162;
        break;

      case 5:
        lGoal += 348;
        break;
    }

    let lDayProtein;
    let lDayCarbohydrate;
    let lDayFat;

    lCaloricDayBalance = lBasalMetabolicRate + lIntensityExercise + lGoal;
    lDayProtein = this.userProfile.weight * 1.5
    lDayFat = this.userProfile.weight
    lDayCarbohydrate = (lCaloricDayBalance - ((lDayProtein * 4) + (lDayFat * 9)))  / 4

    this.dietAmount.totalProtein = lDayProtein;
    this.dietAmount.totalFat = this.userProfile.weight;
    this.dietAmount.totalCarbohydrate = lDayCarbohydrate;
    this.dietAmount.totalCalories = lCaloricDayBalance;

    this.foodService.getFoodByType(2)
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
        lResultMeal.calorie = Math.round(lFood.calorie);
        lResultMeal.fat = Math.round(lFat);
        lResultMeal.protein = Math.round(lProtein);
        lResultMeal.carbohydrate = Math.round(lCarbohydrates);

        this.result.push(lResultMeal);
        this.resultO.next(this.result);
      });

    this.foodService.getFoodByType(1)
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
        lResultMeal.calorie = Math.round(lFood.calorie);
        lResultMeal.fat = Math.round(lFat);
        lResultMeal.protein = Math.round(lProtein);
        lResultMeal.carbohydrate = Math.round(lCarbohydrates);

        this.result.push(lResultMeal);
        this.resultO.next(this.result);
      });

    this.foodService.getFoodByType(0)
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
          lResultMeal.fat = Math.round(lFood.fat);
          lResultMeal.calorie = Math.round(lFood.calorie);
          lResultMeal.protein = Math.round(lFood.protein);
          lResultMeal.carbohydrate = Math.round(lFood.carbohydrate);
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
          return data.map(action => ({ id: action.payload.doc.id, ...action.payload.doc.data(), dateFormatted: new Date(`${action.payload.doc.data()["date"]} GMT-0300`) }))
            .sort((a, b) => b.dateFormatted.getTime() - a.dateFormatted.getTime());
        })
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
          return data.map(action => ({ ...action.payload.doc.data(), id: action.payload.doc.id, dateFormatted: new Date(`${action.payload.doc.data()["date"]} GMT-0300`) }));
        }),
        take(1)
      )
  }

  deleteDiet(dietId) {
    return this.afFirestore.collection(`user/${this.authService.getUser().id}/diet`).doc(dietId).delete();
  }
}