import { Component, OnInit } from '@angular/core';
import { FoodPreferencesService } from './food-preferences.service';

@Component({
  selector: 'app-food-preferences',
  templateUrl: './food-preferences.component.html'
})
export class FoodPreferencesComponent implements OnInit {

  constructor(
    private foodPreferencesService: FoodPreferencesService
  ) { }

  ngOnInit() { }

}
