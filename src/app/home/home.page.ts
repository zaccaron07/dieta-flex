import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { HistoricService } from '../historic/historic.service';
import { HistoricData } from '../historic/historic.model';
import { DietService } from '../diet/diet.service';
import { Diet } from '../diet/diet-data.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html'
})
export class HomePage {

  todayDiet: Diet
  isUpdateHistoric: Boolean

  constructor(
    private router: Router,
    public dietService: DietService,
    public alertController: AlertController,
    private historicService: HistoricService
  ) { }

  ionViewWillEnter() {
    this.startHome()
  }

  startHome() {
    this.getLastHistoric()
    this.showTodayDiet()
  }

  openEditDiet(diet: Diet) {
    if (diet) {
      this.router.navigate(['diet-list/diet-add', diet])
    } else {
      this.router.navigate(['diet-list/diet-add'])
    }
  }

  openDashboard() {
    this.router.navigate(['dashboard'])
  }

  openHistoric(){
    this.router.navigate(['historic-list/historic-add'])
  }

  showTodayDiet() {
    let dateNow = new Date();
    let lNewDate = dateNow.getFullYear() + '-' + ('0' + (dateNow.getMonth() + 1)).slice(-2) + '-' + ('0' + dateNow.getDate()).slice(-2)

    this.dietService.getDietByDate(lNewDate)
      .subscribe((diet) => {
        if (diet && diet.length > 0) {
          this.todayDiet = diet['0']
        }
      })
  }

  private getLastHistoric() {
    this.historicService.getLastHistoric()
      .subscribe((historicList) => {
        if (historicList && historicList.length > 0) {
          historicList = historicList.sort((a, b) => b.timeOrderBy.getTime() - a.timeOrderBy.getTime())
          this.showCardHistoric(historicList[0])
        }
      })
  }

  private showCardHistoric(historic: HistoricData) {
    let lDate = new Date()
    let lOneWeekAgoDate = lDate.getDate() - 7
    lDate.setDate(lOneWeekAgoDate)

    this.isUpdateHistoric = (historic.timeOrderBy.getTime() <= lDate.getTime())
  }
}
