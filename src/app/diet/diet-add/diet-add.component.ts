import { Component, OnInit } from '@angular/core';
import { DietResult, DietAmount } from '../diet-data.model';
import { ModalController, ToastController } from '@ionic/angular';
import { DietModalComponent } from '../diet-modal/diet-modal.component';
import { FoodData } from '../../food/food-data.model';
import { map, switchMap, take } from 'rxjs/operators';
import { FoodService } from '../../food/food.service';
import { DietService } from '../diet.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-diet',
  templateUrl: './diet-add.component.html',
})
export class DietComponent implements OnInit {

  public dietResult: DietResult[];
  public dietAmount = {} as DietAmount;
  public totalDietAmount = {} as DietAmount;
  public food = [] as FoodData[];
  public foodOriginal = [] as FoodData[];
  public dietReady: boolean = true;
  public dietId: String;
  public dietDate: string;
  public dietDateFormatted
  public isEditing: boolean = false;
  public dateInvalid = false
  public minSelectableDate

  constructor(
    private foodService: FoodService,
    private dietService: DietService,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
    this.initializeMimDate()

    this.activatedRoute.params.subscribe(params => {
      let date = params.date
      if (date) {
        this.getDietByDate(date)
        this.isEditing = true
      } else {
        this.isEditing = false
        this.initializeDate()
      }
    });
  }

  getDietByDate(date) {
    this.dietService.getDietByDate(date)
      .pipe(
        map(result => {
          if (result[0]) {
            this.dietResult = result[0]["alimentos"];
            this.totalDietAmount = result[0]["detalhes"];
            this.food = result[0]["food"];
            this.dietId = result[0]["id"];
            this.dietDate = result[0]["date"];
            this.dietDateFormatted = result[0]["dateFormatted"]
            this.verifyDateValid()

            this.loadDietAmount();
          } else {
            this.initializeDate()
          }
        }),
        switchMap(() => {
          return this.foodService.getFood()
        }),
        take(1)

      ).subscribe((result) => {
        result.forEach(result => {
          this.food.forEach(food => {
            if (result["id"] == food.id) {
              this.foodOriginal.push(JSON.parse(JSON.stringify(result)));
            }
          })
        })
      })
  }

  generateDiet() {
    this.dietReady = false;
    this.food = [];
    this.foodOriginal = [];
    this.dietService.generateDiet();

    this.dietService.resultO.subscribe((result) => {
      this.dietResult = result as DietResult[];

      this.loadDietAmount();

      this.totalDietAmount = this.dietService.dietAmount;

      this.dietReady = true;
    });
  }

  loadDietAmount() {
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
  }

  async saveDiet() {
    let lDadosSalvar = {
      alimentos: this.dietResult,
      food: this.food,
      detalhes: this.totalDietAmount
    };

    lDadosSalvar["date"] = this.dietDate.substr(0, 10);

    if (this.dietId) {
      lDadosSalvar["id"] = this.dietId;
      await this.dietService.createDiet(lDadosSalvar);
    } else {
      this.dietService.getDietByDate(lDadosSalvar["date"])
        .subscribe((result) => {
          if (result[0]) {
            lDadosSalvar["id"] = result[0]["id"];
          }
          this.dietService.createDiet(lDadosSalvar);
        });
    };

    await this.presentToast();

    this.router.navigate(['diet-list']);
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Dados cadastrados com sucesso!',
      duration: 4000
    });
    toast.present();
  }

  openModal() {
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: DietModalComponent,
      componentProps: { value: 123 }
    });

    modal.onDidDismiss().then((detail) => {
      if (detail !== null) {
        let lFood: FoodData;

        lFood = detail.data;
        this.food.push(lFood);
        this.foodOriginal.push(JSON.parse(JSON.stringify(lFood)));

        this.dietAmount.calories += Math.round(lFood.calorie);
        this.dietAmount.fat += Math.round(lFood.fat);
        this.dietAmount.protein += Math.round(lFood.protein);
        this.dietAmount.carbohydrate += Math.round(lFood.carbohydrate);
      }
    });

    return await modal.present();
  }

  changedAmount(event) {
    let lFood: FoodData;
    let lNewFood = {} as FoodData;
    let lNewAmount: number;

    lNewAmount = 0;
    lNewAmount = event.value;

    lFood = event.food;

    this.dietAmount.calories -= lFood.calorie;
    this.dietAmount.fat -= lFood.fat;
    this.dietAmount.protein -= lFood.protein;
    this.dietAmount.carbohydrate -= lFood.carbohydrate;

    lNewFood.calorie = 0;
    lNewFood.fat = 0;
    lNewFood.protein = 0;
    lNewFood.carbohydrate = 0;
    lNewFood.amount = lNewAmount;

    if (lFood.portion) {
      lNewFood.calorie = lNewAmount * this.foodOriginal[event.indice].calorie;
      lNewFood.fat = lNewAmount * this.foodOriginal[event.indice].fat;
      lNewFood.protein = lNewAmount * this.foodOriginal[event.indice].protein;
      lNewFood.carbohydrate = lNewAmount * this.foodOriginal[event.indice].carbohydrate;
    } else {
      lNewFood.calorie = (lNewAmount * this.foodOriginal[event.indice].calorie) / 100;
      lNewFood.fat = (lNewAmount * this.foodOriginal[event.indice].fat) / 100;
      lNewFood.protein = (lNewAmount * this.foodOriginal[event.indice].protein) / 100;
      lNewFood.carbohydrate = (lNewAmount * this.foodOriginal[event.indice].carbohydrate) / 100;
    }

    this.dietAmount.calories += lNewFood.calorie;
    this.dietAmount.fat += lNewFood.fat;
    this.dietAmount.protein += lNewFood.protein;
    this.dietAmount.carbohydrate += lNewFood.carbohydrate;

    this.food[event.indice].calorie = lNewFood.calorie;
    this.food[event.indice].fat = lNewFood.fat;
    this.food[event.indice].protein = lNewFood.protein;
    this.food[event.indice].carbohydrate = lNewFood.carbohydrate;
  }

  initializeDate() {
    let dateNow = new Date()
    let lFormattedDate = `${dateNow.getFullYear()}-${('0' + (dateNow.getMonth() + 1)).slice(-2)}-${('0' + dateNow.getDate()).slice(-2)}`
    this.dietDate = lFormattedDate
  }

  initializeMimDate() {
    let dateNow = new Date()
    this.minSelectableDate = new Date(dateNow + " GMT-0000").toISOString()
  }

  verifyDateValid(teste?) {
    let dateNow = new Date()

    if (this.dietDateFormatted < dateNow) {
      this.dateInvalid = true
    }
  }
}
