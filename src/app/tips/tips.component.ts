import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.scss'],
})
export class TipsComponent implements OnInit {

  constructor() { }
  tipsProfileForm: FormGroup;

  ngOnInit() {
    this.initTipsProfileForm();
  }

  private initTipsProfileForm(){
    this.tipsProfileForm = new FormGroup({
      'text': new FormControl( "", Validators.required),
    });
  }
}