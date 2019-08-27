import { Component, OnInit } from '@angular/core';
import { TipsService } from '../tips.service';
import { Observable, Subject } from 'rxjs';
import { TipsData } from '../tips-data.model';
import { FormControl } from '@angular/forms';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-tips-list',
  templateUrl: './tips-list.component.html',
})
export class TipsListComponent implements OnInit {

  public searchControl: FormControl;
  listTips: Observable<any[]>
  listTipsBase: Observable<any[]>

  constructor(private tipsService: TipsService) {
    this.searchControl = new FormControl();
  }

  ngOnInit() {
    this.getListTips();

    this.searchControl.valueChanges
      .pipe(debounceTime(700))
      .subscribe(search => {
        this.setFilteredItems(search);
      });
  }

  getListTips() {
    this.listTips = this.tipsService.getTips();
    this.listTipsBase = this.listTips;
  }

  setFilteredItems(searchTerm) {

    if (!searchTerm) {
      return this.listTips = this.listTipsBase;
    }

    this.listTips = this.listTipsBase
      .pipe(
        map(listTips => listTips.filter((filtering) => {
          if (filtering.title && searchTerm) {
            return filtering.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
          }
        }))
      );
  }
}
