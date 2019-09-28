import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UserProfileData } from '../user-profile/user-profile.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { FoodService } from '../food/food.service';
import { DietFood, Diet, DietBalance } from './diet-data.model';

@Injectable({
  providedIn: 'root'
})
export class DietService {
  public diet = {} as Diet
  private userProfile: UserProfileData;

  constructor(
    private foodService: FoodService,
    private authService: AuthService,
    private afFirestore: AngularFirestore
  ) { }

  async generateDietBalance(): Promise<DietBalance> {
    let lGoal: number = 0;
    let lBasalMetabolicRate: number = 0;
    let lIntensityExercise: number = 0;

    let dietBalance = {} as DietBalance

    const MALE = 1;

    this.userProfile = this.authService.getUser()

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
    dietBalance.totalDayCalories = lBasalMetabolicRate + lIntensityExercise + lGoal
    dietBalance.totalDayProtein = this.userProfile.weight * 1.5
    dietBalance.totalDayFat = this.userProfile.weight
    dietBalance.totalDayCarbohydrate = (dietBalance.totalDayCalories - ((dietBalance.totalDayProtein * 4) + (dietBalance.totalDayFat * 9))) / 4

    this.diet.dietBalance = dietBalance

    return dietBalance
  }

  async generateDietFoods(): Promise<boolean> {
    let generatedDiet: boolean = true

    if (this.diet.dietBalance.totalDayCarbohydrate < 0) {
      generatedDiet = false
    }

    if (generatedDiet) {
      await this.getFoodByType1()
      await this.getFoodByType2()
      await this.getFoodByType0()

      this.loadCurrentBalance()
    }

    return generatedDiet
  }

  async getFoodByType0() {
    const food = await this.foodService.getFoodByType(0).toPromise()

    let lRandom: number
    let lPrevious: number
    let foodResult = {} as DietFood

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

      foodResult = food[lRandom];
      foodResult.amount = 1

      foodResult.calorie = Math.round((foodResult.amount * foodResult.calorie) / 100)
      this.diet.foods.push(JSON.parse(JSON.stringify(foodResult)))

      lPrevious = lRandom;
    }
  }

  async getFoodByType1() {
    const food = await this.foodService.getFoodByType(1).toPromise()

    let lRandom;
    let foodAmount: number
    let foodResult = {} as DietFood;

    lRandom = Math.floor(Math.random() * food.length)

    foodResult = food[lRandom]

    foodAmount = Math.round((100 * (0.15 * this.diet.dietBalance.totalDayCarbohydrate)) / foodResult.carbohydrate)

    foodResult.name = foodResult.name
    foodResult.amount = foodAmount
    foodResult.calorie = Math.round((foodAmount * foodResult.calorie) / 100)
    foodResult.fat = Math.round((foodAmount * foodResult.fat) / 100)
    foodResult.protein = Math.round((foodAmount * foodResult.protein) / 100)
    foodResult.carbohydrate = Math.round((foodAmount * foodResult.carbohydrate) / 100)

    this.diet.foods.push(JSON.parse(JSON.stringify(foodResult)))
  }

  async getFoodByType2() {

    const food = await this.foodService.getFoodByType(2).toPromise()

    let lRandom
    let foodAmount: number
    let foodResult = {} as DietFood

    lRandom = Math.floor(Math.random() * food.length)

    foodResult = food[lRandom]

    foodAmount = Math.round((100 * (0.2 * this.diet.dietBalance.totalDayProtein)) / foodResult.protein)

    foodResult.name = foodResult.name
    foodResult.amount = foodAmount
    foodResult.calorie = Math.round((foodAmount * foodResult.calorie) / 100)
    foodResult.fat = Math.round((foodAmount * foodResult.fat) / 100)
    foodResult.protein = Math.round((foodAmount * foodResult.protein) / 100)
    foodResult.carbohydrate = Math.round((foodAmount * foodResult.carbohydrate) / 100)

    this.diet.foods.push(JSON.parse(JSON.stringify(foodResult)))
  }

  loadCurrentBalance() {
    this.diet.foods.forEach((food) => {
      this.diet.dietBalance.currentCalories = +this.diet.dietBalance.currentCalories ? this.diet.dietBalance.currentCalories + food.calorie : food.calorie
      this.diet.dietBalance.currentFat = +this.diet.dietBalance.currentFat ? this.diet.dietBalance.currentFat + food.fat : food.fat
      this.diet.dietBalance.currentProtein = this.diet.dietBalance.currentProtein = +this.diet.dietBalance.currentProtein ? this.diet.dietBalance.currentProtein + food.protein : food.protein
      this.diet.dietBalance.currentCarbohydrate = this.diet.dietBalance.currentCarbohydrate = +this.diet.dietBalance.currentCarbohydrate ? this.diet.dietBalance.currentCarbohydrate + food.carbohydrate : food.carbohydrate
    });
  }

  createDiet(diet: Diet) {
    if (diet.id && diet.id != "") {
      return this.afFirestore.collection(`user/${this.authService.getUser().id}/diet`).doc(diet["id"]).update(diet)
    } else {
      return this.afFirestore.collection(`user/${this.authService.getUser().id}/diet`).add(diet);
    }
  }

  getDiet() {
    return this.afFirestore.collection<Diet>(`user/${this.authService.getUser().id}/diet`)
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
          return data.map(action => (
            { ...action.payload.doc.data(), id: action.payload.doc.id, dateFormatted: new Date(`${action.payload.doc.data()["date"]} GMT-0300`) } as Diet
          ))
        }),
        take(1)
      )
  }

  deleteDiet(dietId) {
    return this.afFirestore.collection(`user/${this.authService.getUser().id}/diet`).doc(dietId).delete();
  }
}