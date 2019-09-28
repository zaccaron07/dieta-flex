import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { HistoricData } from '../historic/historic.model';
import { HistoricService } from '../historic/historic.service';
import { DashboardGenerate } from './dashboard-generate';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  @ViewChild('historicDashboard', { static: true }) historicDashboard;
  @ViewChild('dietDashboard', { static: true }) dietDashboard;

  historicGraphic: any;
  dietGraphic: any;

  constructor(
    private historicService: HistoricService
  ) { }

  ngOnInit() {
    this.createHistoricDashboard();
    this.createDietDashboard();
  }

  private createHistoricDashboard() {

    let generateGraphic: DashboardGenerate;

    generateGraphic = new DashboardGenerate();

    generateGraphic.addLabels(['01-05-2019', '01-06-2019', '01-07-2019', '01-08-2019', '01-09-2019']);
    generateGraphic.addDataSet('Bíceps(cm)', [15, 16, 16.4, 16.5, 16.7, 17]);
    generateGraphic.addDataSet('Panturrilha(cm)', [27, 27.5, 27.9, 28.3, 28.9, 29.8]);
    generateGraphic.addDataSet('Coxa(cm)', [35, 36, 38, 38.5, 39, 40]);
    generateGraphic.addDataSet('Barriga(cm)', [59, 60, 61, 63, 62, 61]);
    generateGraphic.addDataSet('Peito(cm)', [65, 67, 70, 72, 70, 71]);
    generateGraphic.addDataSet('Peso(kg)', [70, 72, 74, 76, 77, 80]);

    console.log(generateGraphic.getGraphicData())

    this.historicGraphic = new Chart(this.historicDashboard.nativeElement, {
      type: 'line',
      data: generateGraphic.getGraphicData(),
    });
  }

  private createDietDashboard(){
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
