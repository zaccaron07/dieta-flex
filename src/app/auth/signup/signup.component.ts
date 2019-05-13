import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AuthData } from '../auth-data.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {

  constructor(
    private afAuth: AuthService,
    private router: Router
  ) { }

  ngOnInit() { }

  registerUser(authData: AuthData) {
    this.afAuth.registerUser(authData).then((success) => {
      this.router.navigate(['/home']);
    });
  }

}
