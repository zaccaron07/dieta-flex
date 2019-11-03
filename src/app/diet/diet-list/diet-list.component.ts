import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DietService } from '../diet.service';
import { Diet } from '../diet-data.model';

@Component({
  selector: 'app-diet-list',
  templateUrl: './diet-list.component.html'
})
export class DietListComponent implements OnInit {

  public searchControl: FormControl;
  public listDiet: Diet[]
  public listDietBase: Diet[]
  private subscription: Subscription

  constructor(
    private dietService: DietService,
    private router: Router
  ) {
    this.searchControl = new FormControl();
  }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(700))
      .subscribe(search => {
        this.setFilteredItems(search);
      });
  }

  openEditDiet(diet: Diet) {
    this.router.navigate(['diet-list/diet-add', diet])
  }

  getListDiet() {
    this.subscription = this.dietService.getDiet().subscribe((listDiet) => {
      this.listDiet = listDiet
      this.listDietBase = this.listDiet
    })
  }

  removeDiet(Diet: Diet) {
    this.dietService.deleteDiet(Diet.id)
  }

  setFilteredItems(searchTerm) {
    if (!searchTerm) {
      return this.listDiet = this.listDietBase;
    }

    this.listDiet = this.listDietBase.filter((filtering) => {
      if (filtering.date && searchTerm) {
        return filtering.date.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
      }
    })
  }

  ionViewWillEnter() {
    this.getListDiet()
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe()
  }
}