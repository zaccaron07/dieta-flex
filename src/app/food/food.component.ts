import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FoodService } from './food.service';
import { ToastController } from '@ionic/angular';
import { FoodData } from './food-data.model';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.scss'],
})
export class FoodComponent implements OnInit {

  foodForm: FormGroup;
  food: FoodData;

  constructor(
    private router: ActivatedRoute,
    private foodService: FoodService,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.initFoodForm();
  }
  ngOpen() {
    this.initFoodForm();
  }

  private initFoodForm() {

    let lbExisteParam: boolean;

    this.router.params.subscribe(params => {
      console.log(JSON.stringify(params))

      lbExisteParam = (params.id != undefined)

      this.foodForm = new FormGroup({
        'id': new FormControl(lbExisteParam ? params.id : '', Validators.required),
        'name': new FormControl(lbExisteParam ? params.name : '', Validators.required),
        'calorie': new FormControl(lbExisteParam ? params.calorie : '', Validators.required),
        'carbohydrate': new FormControl(lbExisteParam ? params.carbohydrate : '', Validators.required),
        'protein': new FormControl(lbExisteParam ? params.protein : '', Validators.required),
        'fat': new FormControl(lbExisteParam ? params.fat : '', Validators.required),
        'portion': new FormControl(lbExisteParam ? params.portion : false, Validators.required)
      });
    });
  }

  onSubmit() {
    this.presentToast();
    this.foodService.createFood(this.foodForm.value);
    this.initFoodForm();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Dados cadastrados com sucesso!',
      duration: 2000
    });

    toast.present();
  }
}