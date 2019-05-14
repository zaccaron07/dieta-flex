import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { UserProfileService } from '../user-profile.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {

  constructor(
    private userProfileService: UserProfileService,
    public toastController: ToastController
  ) { }

  userProfileForm: FormGroup;

  ngOnInit() {
    this.initUserProfileForm();
  }

  private initUserProfileForm() {
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
      .then(succes => {
        this.presentToast();
        this.initUserProfileForm();
      })
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Dados cadastrados com sucesso!',
      duration: 2000
    })
    toast.present();
  }

}
