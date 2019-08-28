import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { HistoricData } from '../historic.model';
import { Router, ActivatedRoute } from '@angular/router';
import { HistoricService } from '../historic.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-historic-add',
  templateUrl: './historic-add.component.html',
})
export class HistoricAddComponent implements OnInit {

  HistoricForm: FormGroup;
  Historic: HistoricData;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private historicService: HistoricService,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.initHistoricForm();
  }
  ngOpen() {
    this.initHistoricForm();
  }

  private initHistoricForm() {

    let lbExisteParam: boolean;

    this.activatedRoute.params.subscribe(params => {

      lbExisteParam = (params.id != undefined)

      this.HistoricForm = new FormGroup({
        'id': new FormControl(lbExisteParam ? params.id : null, Validators.required),
        'weight': new FormControl(lbExisteParam ? params.weight : '', Validators.required),
        'biceps': new FormControl(lbExisteParam ? params.biceps : '', Validators.required),
        'thigh': new FormControl(lbExisteParam ? params.thigh : '', Validators.required),
        'calf': new FormControl(lbExisteParam ? params.calf : '', Validators.required),
        'belly': new FormControl(lbExisteParam ? params.belly : '', Validators.required),
        'chest': new FormControl(lbExisteParam ? params.chest : false, Validators.required)
      });
    });
  }

  onSubmit() {
    this.presentToast();
    console.log(JSON.stringify(this.HistoricForm.value))
    this.historicService.createHistoric(this.HistoricForm.value)
      .then(() => {
        this.router.navigate(['historic-list'])
      })
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Dados cadastrados com sucesso!',
      duration: 2000
    });

    toast.present();
  }
}
