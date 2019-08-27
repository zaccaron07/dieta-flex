import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TipsService } from '../tips.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tips-add',
  templateUrl: './tips-add.component.html',
})
export class TipsAddComponent implements OnInit {

  constructor(
    private tipsService: TipsService,
    public toastController: ToastController
  ) { }
  tipsForm: FormGroup;

  ngOnInit() {
    this.initTipsProfileForm();
  }

  private initTipsProfileForm() {
    this.tipsForm = new FormGroup({
      'title': new FormControl("", Validators.required),
      'text': new FormControl("", Validators.required),
    });
  }

  onSubmit() {
    this.tipsService.createTips(this.tipsForm.value)
      .then(succes => {
        this.presentToast();
        this.initTipsProfileForm();
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