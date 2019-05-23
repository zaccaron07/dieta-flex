import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { UserProfileService } from '../user-profile.service';
import { AuthService } from 'src/app/auth/auth.service';
import { UserProfileData } from '../user-profile.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {

  constructor(
    private userProfileService: UserProfileService,
    private toastController: ToastController,
    private authService: AuthService,
    private router: Router
  ) { }

  userProfileForm: FormGroup;

  ngOnInit() {
    this.initUserProfileForm();
  }

  private initUserProfileForm() {
    let lUser = {} as UserProfileData;

    this.userProfileForm = new FormGroup({
      'name': new FormControl(""),
      'email': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required),
      'gender': new FormControl(1, Validators.required),
      'age': new FormControl("", Validators.required),
      'goal': new FormControl(0, Validators.required),
      'weight': new FormControl("", Validators.required),
      'height': new FormControl("", Validators.required),
      'exercise_intensity': new FormControl("", Validators.required),
      'work_intensity': new FormControl("", Validators.required)
    });

    this.authService.userChanged.subscribe(user => {
      lUser = user;

      this.userProfileForm.patchValue(lUser);
    });
  }

  onSubmit() {
    this.userProfileService.createUserProfile(this.userProfileForm.value)
      .then(() => {
        this.presentToast().then(() => {
          this.router.navigate(['home']);
        });
      });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Dados cadastrados com sucesso!',
      duration: 2000
    });

    toast.present();
  }

}
