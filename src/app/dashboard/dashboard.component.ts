import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { HistoricData } from '../historic/historic.model';
import { HistoricService } from '../historic/historic.service';
import { DashboardGenerate } from './dashboard-generate';
import { Subscription } from 'rxjs';

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
  private subscription: Subscription;

  constructor(
    private historicService: HistoricService
  ) { }

  ngOnInit() {
    this.createHistoricDashboard();
    this.createDietDashboard();
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe()
  }

  ionViewWillEnter() {
    this.createHistoricDashboard();
    this.createDietDashboard();
  }
  
  private createHistoricDashboard() {

    let generateGraphic: DashboardGenerate;

    let weightList: number[];
    let bicepsList: number[];
    let thighList: number[];
    let calfList: number[];
    let bellyList: number[];
    let chestList: number[];
    let timeList: string[];

    this.subscription = this.historicService.getHistoric().subscribe((historicListReturned) => {

      weightList = []
      bicepsList = []
      thighList = []
      calfList = []
      bellyList = []
      chestList = []
      timeList = []

      this.historicList = historicListReturned

      this.historicList.forEach((historic) => {
        timeList.push(historic.time)
        weightList.push(historic.weight)
        bicepsList.push(historic.biceps)
        thighList.push(historic.thigh)
        calfList.push(historic.calf)
        bellyList.push(historic.belly)
        chestList.push(historic.chest)
      })

      generateGraphic = new DashboardGenerate();

      generateGraphic.addLabels(timeList);
      generateGraphic.addDataSet('Bíceps(cm)', bicepsList);
      generateGraphic.addDataSet('Panturrilha(cm)', calfList);
      generateGraphic.addDataSet('Coxa(cm)', thighList);
      generateGraphic.addDataSet('Barriga(cm)', bellyList);
      generateGraphic.addDataSet('Peito(cm)', chestList);
      generateGraphic.addDataSet('Peso(kg)', weightList);

      console.log(generateGraphic.getGraphicData())

      this.historicGraphic = new Chart(this.historicDashboard.nativeElement, {
        type: 'line',
        data: generateGraphic.getGraphicData(),
      });
    });
  }

  private createDietDashboard() {
    let generateGraphic: DashboardGenerate;

    generateGraphic = new DashboardGenerate();

    generateGraphic.setBackgroundTransparent(true);

    generateGraphic.addLabels(['01-05-2019', '01-06-2019', '01-07-2019', '01-08-2019', '01-09-2019']);

    generateGraphic.addDataSet('Esperado', [2700, 2700, 2700, 2700, 2700, 2700]);
    generateGraphic.addDataSet('Consumido', [2500, 2900, 2780, 2450, 2400, 3200]);

    this.dietGraphic = new Chart(this.dietDashboard.nativeElement, {
      type: 'line',
      data: generateGraphic.getGraphicData(),
    });
  }
}
