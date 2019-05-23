import { Component, OnInit } from '@angular/core';
import { NewDietService, DietResult } from './new-diet.service';

@Component({
  selector: 'app-diet',
  templateUrl: './diet.component.html',
  styleUrls: ['./diet.component.scss'],
})
export class DietComponent implements OnInit {

  public dietResult: DietResult[];

  constructor(
    private dietService: NewDietService
  ) { }

  ngOnInit() { }

  generateDiet() {
    this.dietService.generateDiet();

    this.dietService.resultO.subscribe((result) => {
      this.dietResult = result as DietResult[];
      console.log(result);
    });
  }

}
