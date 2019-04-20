import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AuthData } from '../auth-data.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

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
    this.authService.loginWithGoogle();
  }

}
