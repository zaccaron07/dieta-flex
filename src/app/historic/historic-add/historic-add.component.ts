import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HistoricService } from '../historic.service';
import { ToastController } from '@ionic/angular';
import { switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-historic-add',
  templateUrl: './historic-add.component.html',
})
export class HistoricAddComponent implements OnInit {

  historicForm: FormGroup;
  historicStatic;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private historicService: HistoricService,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.initHistoricForm()
  }

  private initHistoricForm() {

    let lbExisteParam: boolean;

    this.activatedRoute.params.subscribe(params => {

      lbExisteParam = (params.id != undefined)

      this.historicForm = new FormGroup({
        'id': new FormControl(lbExisteParam ? params.id : null, Validators.required),
        'weight': new FormControl(lbExisteParam ? params.weight : '', Validators.required),
        'biceps': new FormControl(lbExisteParam ? params.biceps : '', Validators.required),
        'thigh': new FormControl(lbExisteParam ? params.thigh : '', Validators.required),
        'calf': new FormControl(lbExisteParam ? params.calf : '', Validators.required),
        'belly': new FormControl(lbExisteParam ? params.belly : '', Validators.required),
        'chest': new FormControl(lbExisteParam ? params.chest : false, Validators.required),
        'time': new FormControl(lbExisteParam ? params.time : '', Validators.required)
      });
    });
  }

  onSubmit() {
    let lDate;
    let lNewDate;
    this.presentToast();

    lDate = new Date();

    if (this.historicForm.value.time === '') {
      lNewDate = ('0' + lDate.getDate()).slice(-2) + '/' + ('0' + (lDate.getMonth() + 1)).slice(-2) + '/' + lDate.getFullYear();
      this.historicForm.value.time = lNewDate;
    }

    this.historicStatic = this.historicService.documentExists(this.historicForm.value)
      .pipe(
        switchMap(result => this.historicService.createHistoric(this.historicForm.value, result)),
        take(1)
      )
      .subscribe(() => {
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
