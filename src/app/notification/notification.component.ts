import { Component, OnInit } from '@angular/core';
import { LocalNotificationActionPerformed } from '@capacitor/core';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
})
export class NotificationComponent implements OnInit {
  public notification: LocalNotificationActionPerformed;
  public title: String;
  public message: String;

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    let notificationId: number;

    this.notification = this.notificationService.getNotification();
    notificationId = this.notification.notificationRequest.id;

    //Buscar do firebase depois
    switch (notificationId) {
      case 1:
        this.title = this.notification.notificationRequest.title;
        this.message = "";
    }
  }

}
