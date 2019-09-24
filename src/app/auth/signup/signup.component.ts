import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AuthData } from '../auth-data.model';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {

  constructor(
    private afAuth: AuthService,
    private navController: NavController   
  ) { }

  ngOnInit() { }

  registerUser(authData: AuthData) {
    this.afAuth.registerUser(authData).then(() => {
      this.navController.navigateRoot('/home')
    });
  }

}
