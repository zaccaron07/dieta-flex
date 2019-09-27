import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { HistoricData } from '../historic/historic.model';
import { HistoricService } from '../historic/historic.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  @ViewChild('barChart') barChart;

  bars: any;
  colorArray: any;

  public historicList: HistoricData[];

  constructor(
    private historicService: HistoricService
  ) { }

  ngOnInit() {
    this.createBarChart()
  }

  createBarChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['01-05-2019', '01-06-2019', '01-07-2019', '01-08-2019', '01-09-2019'],
        datasets: [
          {
            label: 'Bíceps(cm)',
            data: [15, 16, 16.4, 16.5, 16.7, 17],
            //backgroundColor: '#008080',
            backgroundColor: 'transparent',
            borderColor: '#008080',
            borderWidth: 1
          },
          {
            label: 'Panturrilha(cm)',
            data: [27, 27.5, 27.9, 28.3, 28.9, 29.8],
            //backgroundColor: '#009933',
            backgroundColor: 'transparent',
            borderColor: '#009933',
            borderWidth: 1
          },
          {
            label: 'Coxa(cm)',
            data: [35, 36, 38, 38.5, 39, 40],
            //backgroundColor: '#dd1334',
            backgroundColor: 'transparent',
            borderColor: '#dd1144',
            borderWidth: 1
          },
          {
            label: 'Barriga(cm)',
            data: [59, 60, 61, 63, 62, 61],
            //backgroundColor: '#0000ff',
            backgroundColor: 'transparent',
            borderColor: '#0000ff',
            borderWidth: 1
          },
          {
            label: 'Peito(cm)',
            data: [65, 67, 70, 72, 70, 71],
            //backgroundColor: '#660066',
            backgroundColor: 'transparent',
            borderColor: '#660066',
            borderWidth: 1
          },
          {
            label: 'Peso(kg)',
            data: [70, 72, 74, 76, 77, 80],
            //backgroundColor: '#ddee44',
            backgroundColor: 'transparent',
            borderColor: '#ddee44',
            borderWidth: 1
          },

        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false
            }
          }]
        }
      }
    });
  }
}
