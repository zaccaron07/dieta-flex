import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
import { NotificationService } from '../notification/notification.service';
import { Platform, AlertController } from '@ionic/angular';
import { HistoricService } from '../historic/historic.service';
import { HistoricData } from '../historic/historic.model';
import { DietService } from '../diet/diet.service';
import { Observable } from 'rxjs';
import { DietData } from '../diet/diet-data.model';

const { LocalNotifications } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html'
})
export class HomePage {

  dietToday: Observable<DietData>

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private platform: Platform,
    private historicService: HistoricService,
    public alertController: AlertController,
    public dietService: DietService
  ) { }

  ngOnInit() {

    this.startHome();

    if (this.platform.is('cordova')) {
      Plugins.LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
        this.notificationService.setNotification(notification);
        this.router.navigate(["/notification"]);
      });
    }
  }

  startHome() {
    this.dietToday = null;
    this.scheduleNotification();
    this.showDietToday();
  }

  openEditDiet(diet: DietData) {
    if (diet) {
      this.router.navigate(['diet-list/diet-add', diet])
    } else {
      this.router.navigate(['diet-list/diet-add'])
    }
  }

  ionViewWillEnter() {
    this.startHome();
  }

  openDashboard() {
    this.router.navigate(['dashboard'])
  }

  showDietToday() {
    let dateNow = new Date();
    let lNewDate = dateNow.getFullYear() + '-' + ('0' + (dateNow.getMonth() + 1)).slice(-2) + '-' + ('0' + dateNow.getDate()).slice(-2);

    this.dietService.getDietByDate(lNewDate)
      .subscribe((diet) => {
        if (diet && diet.length > 0) {
          this.dietToday = diet['0'];
        }
      });
  }

  scheduleNotification() {

    this.getLastHistoric()

    if (this.platform.is('cordova')) {
      LocalNotifications.schedule({
        notifications: [
          {
            title: "Prática de exercícios para o emagrecimento",
            body: "Acesse o app e confira a nossa nova dica do dia!",
            id: 1,
            schedule: {
              at: new Date(Date.now() + 1000 * 5),
              repeats: true
            },
            sound: null,
            attachments: null,
            actionTypeId: "",
            extra: null,

          }
        ]
      })
    }
  }

  private getLastHistoric() {
    this.historicService.getLastHistoric()
      .subscribe((historicList) => {
        if (historicList && historicList.length > 0) {
          historicList = historicList.sort((a, b) => b.timeOrderBy.getTime() - a.timeOrderBy.getTime())
          this.showNotification(historicList[0])
        }
      })
  }

  private showNotification(historic: HistoricData) {
    let lDate = new Date()
    let lOneWeekAgoDate = lDate.getDate() - 7
    lDate.setDate(lOneWeekAgoDate)

    if (historic.timeOrderBy.getTime() <= lDate.getTime()) {
      this.presentAlert()
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message: 'Atualize seu histórico de medidas!',
      buttons: ['OK']
    })

    await alert.present()
  }

}
