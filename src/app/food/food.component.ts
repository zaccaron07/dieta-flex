import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FoodService } from './food.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.scss'],
})
export class FoodComponent implements OnInit {

  foodForm: FormGroup;

  constructor(
    private foodService: FoodService,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.initFoodForm();
  }

  private initFoodForm() {
    this.foodForm = new FormGroup({
      'name': new FormControl("", Validators.required),
      'calorie': new FormControl("", Validators.required),
      'carbohydrate': new FormControl("", Validators.required),
      'protein': new FormControl("", Validators.required),
      'fat': new FormControl("", Validators.required),
      'portion': new FormControl(false, Validators.required)
    });
  }

  onSubmit() {
    this.foodService.createFood(this.foodForm.value)
      .then(succes => {
        this.presentToast();
      });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Dados cadastrados com sucesso!',
      duration: 2000
    });

    toast.present();
  }
}