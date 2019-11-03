import { Injectable } from '@angular/core';
import { FoodTypeConst, UserProfileGoalConst, ExerciseIntensityConst } from './diet-constants';
import { AuthService } from 'src/app/auth/auth.service';
import { FoodService } from 'src/app/food/food.service';
import { Diet, DietBalance, DietFood } from './../diet-data.model';
import { UserProfileData } from 'src/app/user-profile/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class DietProcess {
  public diet = {} as Diet
  private userProfile: UserProfileData;

  constructor(
    private foodService: FoodService,
    private authService: AuthService
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
      case ExerciseIntensityConst.SLIGHTLY_ACTIVE:
        lIntensityExercise += 193;
        break;

      case ExerciseIntensityConst.MODERATELY_ACTIVE:
        lIntensityExercise += 425;
        break;

      case ExerciseIntensityConst.VERY_ACTIVE:
        lIntensityExercise += 676;
        break;

      case ExerciseIntensityConst.EXTREMELY_ACTIVE:
        lIntensityExercise += 1159;
        break;
    }

    switch (this.userProfile.goal) {
      case UserProfileGoalConst.AGGRESSIVE_WEIGHT_LOSS:
        lGoal -= 695;

        break;

      case UserProfileGoalConst.LOSE_WEIGHT:
        lGoal -= 348;
        break;

      case UserProfileGoalConst.DRY_EARNINGS:
        lGoal += 162;
        break;

      case UserProfileGoalConst.AGGRESSIVE_GAINS:
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
      await this.getFoodCarbohydrate()
      await this.getFoodProtein()
      await this.getFoodPortion()

      this.loadCurrentBalance()
    }

    return generatedDiet
  }

  async getFoodPortion() {
    const food = await this.foodService.getFoodByType(FoodTypeConst.FAT).toPromise()

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

  async getFoodCarbohydrate() {
    const food = await this.foodService.getFoodByType(FoodTypeConst.CARBOHYDRATE).toPromise()

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

  async getFoodProtein() {

    const food = await this.foodService.getFoodByType(FoodTypeConst.PROTEIN).toPromise()

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
    this.diet.dietBalance.currentCalories = 0
    this.diet.dietBalance.currentFat = 0
    this.diet.dietBalance.currentProtein = 0
    this.diet.dietBalance.currentCarbohydrate = 0

    this.diet.foods.forEach((food) => {
      this.diet.dietBalance.currentCalories = +this.diet.dietBalance.currentCalories ? this.diet.dietBalance.currentCalories + food.calorie : food.calorie
      this.diet.dietBalance.currentFat = +this.diet.dietBalance.currentFat ? this.diet.dietBalance.currentFat + food.fat : food.fat
      this.diet.dietBalance.currentProtein = this.diet.dietBalance.currentProtein = +this.diet.dietBalance.currentProtein ? this.diet.dietBalance.currentProtein + food.protein : food.protein
      this.diet.dietBalance.currentCarbohydrate = this.diet.dietBalance.currentCarbohydrate = +this.diet.dietBalance.currentCarbohydrate ? this.diet.dietBalance.currentCarbohydrate + food.carbohydrate : food.carbohydrate
    });
  }
}