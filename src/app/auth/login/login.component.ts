import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AuthData } from '../auth-data.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import * as firebase from 'firebase/app';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    public afAuth: AngularFireAuth,
    private gplus: GooglePlus,
    private platform: Platform) { }

  ngOnInit() {
    this.authService.geAuth().subscribe(auth => {
      if (auth) {
        this.router.navigate(['/home']);
      }
    })
  }

  login(authData: AuthData) {
    this.authService.login(authData)
      .then(res => {
        console.log('Login com sucesso')
        this.router.navigate(['/home']);
      })
      .catch(err => {
        console.log(err)
      })

  }

  loginWithGoogle() {
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin();
    } else {
      this.webGoogleLogin();
    }

  }

  async nativeGoogleLogin(): Promise<any> {
    try {
      const gplusUser = await this.gplus.login({
        'offline': true
      });

      console.log(gplusUser)
      return await this.afAuth.auth.signInWithCredential(
        firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken)
      )

    } catch (err) {
      console.log(err);
    }
  }

  async webGoogleLogin(): Promise<any> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await this.afAuth.auth.signInWithPopup(provider);
    }
    catch (err) {
      console.log(err)
    }
  }

  signOut() {
    this.afAuth.auth.signOut();

    if (this.platform.is('cordova')) {
      this.gplus.logout();
    }
  }

}
