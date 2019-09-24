import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AuthData } from '../auth-data.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  private subscription: Subscription

  constructor(
    private authService: AuthService,
    private navController: NavController,
    public afAuth: AngularFireAuth) {
  }

  ngOnInit() {
    this.subscription = this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.navController.navigateRoot('/home')
      }
    })
  }

  login(authData: AuthData) {
    this.authService.login(authData)
      .then(() => {
        this.navController.navigateRoot('/home')
      })
      .catch(err => {
        console.log(err)
      })
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe()
  }
}