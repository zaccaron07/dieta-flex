import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AuthData } from '../auth-data.model';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    public afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.authService.getAuth().subscribe(auth => {
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

  signOut() {
    this.afAuth.auth.signOut();
  }

}
