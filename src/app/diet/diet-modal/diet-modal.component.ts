import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { NewDietService } from '../new-diet.service';
import { FoodData } from 'src/app/food/food-data.model';

@Component({
  selector: 'app-diet-modal',
  templateUrl: './diet-modal.component.html',
})
export class DietModalComponent implements OnInit {
  @Input() value: number;

  public foodData: FoodData[];

  constructor(
    private foodService: NewDietService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.foodService.getFood()
      .subscribe((result: FoodData[]) => {
        this.foodData = result;
      });
  }

  selectFood(food: FoodData) {
    this.modalController.dismiss(food);
  }

}
