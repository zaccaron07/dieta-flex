import { ChartData, ChartDataSets } from 'chart.js'
import { ColorsGraphic } from './graphic-constants';

export class DashboardGenerate {

  private dataset = [] as ChartDataSets[];
  private data = {} as ChartData;
  private backgroundTransparent = true;

  public setBackgroundTransparent(transparent: boolean) {
    this.backgroundTransparent = transparent;
  }

  public addDataSet(label: string, data: number[]) {

    let nextColor = ColorsGraphic.COLOR_LIST[this.dataset.length + 1];

    this.dataset.push({
      label: label,
      data: data,
      backgroundColor: this.backgroundTransparent ? ColorsGraphic.COLOR_TRANSPARENT : nextColor,
      borderColor: nextColor,
      borderWidth: 1
    });
  }

  public addLabels(labels: string[]) {
    this.data.labels = labels;
  }

  public getGraphicData() {
    this.data.datasets = this.dataset;

    return this.data;
  }

}