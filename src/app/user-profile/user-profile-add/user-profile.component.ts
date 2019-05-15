import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { UserProfileService } from '../user-profile.service';
import { AuthService } from 'src/app/auth/auth.service';
import { UserProfileData } from '../user-profile.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {

  constructor(
    private userProfileService: UserProfileService,
    public toastController: ToastController,
    private authService: AuthService
  ) { }

  userProfileForm: FormGroup;

  ngOnInit() {
    this.initUserProfileForm();
  }

  private initUserProfileForm() {
    let lUser = {} as UserProfileData;

    this.authService.userChanged.subscribe(user => {
      
    })
    console.log(lUser) 
    this.userProfileForm = new FormGroup({
      'name': new FormControl(""),
      'email': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required),
      'age': new FormControl("", Validators.required),
      'goal': new FormControl("", Validators.required),
      'weigth': new FormControl("", Validators.required),
      'heigth': new FormControl("", Validators.required),
      'exercise_intensity': new FormControl("", Validators.required),
      'work_intensity': new FormControl("", Validators.required)
    });
  }

  onSubmit() {
    this.userProfileService.createUserProfile(this.userProfileForm.value)
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Dados cadastrados com sucesso!',
      duration: 2000
    })
    toast.present();
  }

}
