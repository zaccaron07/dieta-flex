import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
import { NotificationService } from '../notification/notification.service';

const { LocalNotifications } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(    
    private router: Router,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.scheduleNotification();

    Plugins.LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      this.notificationService.setNotification(notification);
      this.router.navigate(["/notification"]);
    });
  }

  scheduleNotification() {
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
