import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FoodData } from 'src/app/food/food-data.model';
import { FoodService } from 'src/app/food/food.service';

@Component({
  selector: 'app-diet-modal',
  templateUrl: './diet-modal.component.html',
})
export class DietModalComponent implements OnInit {

  public foodData: FoodData[];

  constructor(
    private foodService: FoodService,
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
