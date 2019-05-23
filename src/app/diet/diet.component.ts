import { Component, OnInit } from '@angular/core';
import { NewDietService } from './new-diet.service';

@Component({
  selector: 'app-diet',
  templateUrl: './diet.component.html',
  styleUrls: ['./diet.component.scss'],
})
export class DietComponent implements OnInit {

  constructor(
    private dietService: NewDietService
  ) { }

  ngOnInit() { }

  generateDiet() {
    this.dietService.generateDiet();
  }

}
