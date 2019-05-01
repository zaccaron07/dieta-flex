import { Injectable } from '@angular/core';
import { LocalNotificationActionPerformed } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notification: LocalNotificationActionPerformed;

  constructor() { }

  setNotification(notification: LocalNotificationActionPerformed) {
    this.notification = notification;
  }

  getNotification(): LocalNotificationActionPerformed {
    return this.notification;
  }
}
