import { Component, OnInit } from '@angular/core';
import { NewDietService, DietResult, DietAmount } from './new-diet.service';

@Component({
  selector: 'app-diet',
  templateUrl: './diet.component.html',
  styleUrls: ['./diet.component.scss'],
})
export class DietComponent implements OnInit {

  public dietResult: DietResult[];
  public dietAmount = {} as DietAmount;
  public totalDietAmount = {} as DietAmount;

  constructor(
    private dietService: NewDietService
  ) { }

  ngOnInit() { }

  generateDiet() {
    this.dietService.generateDiet();

    /*this.dietService.resultOO.subscribe((result) => {
      this.totalDietAmount = result as DietAmount;
    });*/

    this.dietService.resultO.subscribe((result) => {
      this.dietResult = result as DietResult[];

      this.dietAmount.calories = 0;
      this.dietAmount.fat = 0;
      this.dietAmount.protein = 0;
      this.dietAmount.carbohydrate = 0;

      this.dietResult.forEach((food) => {
        this.dietAmount.calories += (food.amount * food.calorie) / 100;
        this.dietAmount.fat += food.fat;
        this.dietAmount.protein += food.protein;
        this.dietAmount.carbohydrate += food.carbohydrate;
      });

      this.totalDietAmount = this.dietService.dietAmount;
    });
  }
}
