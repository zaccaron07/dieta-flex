import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { DietService } from '../diet.service';
import { DietData } from '../diet-data.model';

@Component({
  selector: 'app-diet-list',
  templateUrl: './diet-list.component.html'
})
export class DietListComponent implements OnInit {

  public searchControl: FormControl;
  listDiet: Observable<DietData[]>
  listDietBase: Observable<DietData[]>

  constructor(
    private dietService: DietService,
    private router: Router
  ) {
    this.searchControl = new FormControl();
  }

  ngOnInit() {
    this.getListDiet();

    this.searchControl.valueChanges
      .pipe(debounceTime(700))
      .subscribe(search => {
        this.setFilteredItems(search);
      });
  }

  openEditDiet(diet: DietData) {
    console.log((diet));
    this.router.navigate(['diet-list/diet-add', diet])
  }

  getListDiet() {
    this.listDiet = this.dietService.getDiet();
    this.listDietBase = this.listDiet;
  }

  removeDiet(Diet: DietData) {
    console.log(JSON.stringify(Diet))
    this.dietService.deleteDiet(Diet.id)
  }

  setFilteredItems(searchTerm) {
    if (!searchTerm) {
      return this.listDiet = this.listDietBase;
    }
    
    this.listDiet = this.listDietBase
      .pipe(
        map(listDiet => listDiet.filter((filtering) => {
          if (filtering.date && searchTerm) {
            return filtering.date.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
          }
        }))
      );
  }

  ionViewWillEnter() {
    this.getListDiet();
  }

}