import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { HistoricData } from '../historic/historic.model';
import { HistoricService } from '../historic/historic.service';
import { DashboardGenerate } from './graphic-generate';
import { Subscription } from 'rxjs';
import { TypeGraphic } from './graphic-constants';
import { DietService } from '../diet/diet.service';
import { Diet } from '../diet/diet-data.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  @ViewChild('historicDashboard', { static: true }) historicDashboard;
  @ViewChild('dietDashboard', { static: true }) dietDashboard;

  historicGraphic: any;
  dietGraphic: any;

  private historicList: HistoricData[];
  private dietList: Diet[];

  private subscriptionHistoric: Subscription;
  private subscriptionDiet: Subscription;

  constructor(
    private historicService: HistoricService,
    private dietService: DietService
  ) { }

  ngOnInit() {
    this.createHistoricDashboard();
    this.createDietDashboard();
  }

  ionViewWillLeave() {
    this.subscriptionHistoric.unsubscribe()
    this.subscriptionDiet.unsubscribe()
  }

  ionViewWillEnter() {
    this.createHistoricDashboard();
    this.createDietDashboard();
  }

  private createHistoricDashboard() {

    this.subscriptionHistoric = this.historicService.getHistoric().subscribe((historicListReturned) => {

      let generateGraphic: DashboardGenerate = new DashboardGenerate();

      let weightList: number[] = [];
      let bicepsList: number[] = [];
      let thighList: number[] = [];
      let calfList: number[] = [];
      let bellyList: number[] = [];
      let chestList: number[] = [];
      let timeList: string[] = [];

      this.historicList = historicListReturned.sort((a, b) => a.timeOrderBy.getTime() - b.timeOrderBy.getTime())

      this.historicList.forEach((historic) => {
        timeList.push(historic.time)
        weightList.push(historic.weight)
        bicepsList.push(historic.biceps)
        thighList.push(historic.thigh)
        calfList.push(historic.calf)
        bellyList.push(historic.belly)
        chestList.push(historic.chest)
      })

      generateGraphic.addLabels(timeList);
      generateGraphic.addDataSet('Bíceps(cm)', bicepsList);
      generateGraphic.addDataSet('Panturrilha(cm)', calfList);
      generateGraphic.addDataSet('Coxa(cm)', thighList);
      generateGraphic.addDataSet('Barriga(cm)', bellyList);
      generateGraphic.addDataSet('Peito(cm)', chestList);
      generateGraphic.addDataSet('Peso(kg)', weightList);

      this.historicGraphic = new Chart(this.historicDashboard.nativeElement, {
        type: TypeGraphic.LINE,
        data: generateGraphic.getGraphicData(),
      });
    });
  }

  private createDietDashboard() {

    this.subscriptionDiet = this.dietService.getDiet().subscribe((dietListReturned) => {

      let generateGraphic: DashboardGenerate = new DashboardGenerate();

      let dateDiet: string[] = [];
      let currentFat: number[] = [];
      let currentProtein: number[] = [];
      let currentCalories: number[] = [];
      let currentCarbohydrate: number[] = [];
      let totalDayFat: number[] = [];
      let totalDayProtein: number[] = [];
      let totalDayCalories: number[] = [];
      let totalDayCarbohydrate: number[] = [];

      this.dietList = dietListReturned.sort((a, b) => a.dateFormatted.getTime() - b.dateFormatted.getTime());

      this.dietList.forEach((diet) => {

        dateDiet.push(diet.date)

        currentFat.push(diet.dietBalance.currentFat)
        currentProtein.push(diet.dietBalance.currentProtein)
        currentCalories.push(diet.dietBalance.currentCalories)
        currentCarbohydrate.push(diet.dietBalance.currentCarbohydrate)

        totalDayFat.push(diet.dietBalance.totalDayFat)
        totalDayProtein.push(diet.dietBalance.totalDayProtein)
        totalDayCalories.push(diet.dietBalance.totalDayCalories)
        totalDayCarbohydrate.push(diet.dietBalance.totalDayCarbohydrate)
      })

      generateGraphic.setBackgroundTransparent(true);

      generateGraphic.addLabels(dateDiet);

      generateGraphic.addDataSet('Esperado', totalDayCalories);
      generateGraphic.addDataSet('Consumido', currentCalories);

      this.dietGraphic = new Chart(this.dietDashboard.nativeElement, {
        type: TypeGraphic.LINE,
        data: generateGraphic.getGraphicData(),
      });
    })
  }
}
