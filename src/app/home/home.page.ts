import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
import { NotificationService } from '../notification/notification.service';
import { Platform, AlertController } from '@ionic/angular';
import { HistoricService } from '../historic/historic.service';
import { HistoricData } from '../historic/historic.model';

const { LocalNotifications } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private platform: Platform,
    private historicService: HistoricService,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.scheduleNotification();

    if (this.platform.is('cordova')) {
      Plugins.LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
        this.notificationService.setNotification(notification);
        this.router.navigate(["/notification"]);
      });
    }
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
