import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { HistoricData } from '../historic.model';
import { debounceTime, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HistoricService } from '../historic.service';

@Component({
  selector: 'app-historic-list',
  templateUrl: './historic-list.component.html',
})
export class HistoricListComponent implements OnInit {

  public searchControl: FormControl;
  listHistoric: Observable<HistoricData[]>
  listHistoricBase: Observable<HistoricData[]>

  constructor(
    private historicService: HistoricService,
    private router: Router,
  ) {
    this.searchControl = new FormControl();
  }

  ngOnInit() {
    this.getListHistoric();

    this.searchControl.valueChanges
      .pipe(debounceTime(700))
      .subscribe(search => {
        this.setFilteredItems(search);
      });
  }

  openEditHistoric(Historic: HistoricData) {
    console.log(JSON.stringify(Historic));
    this.router.navigate(['historic-list/historic-add', Historic])
  }

  getListHistoric() {
    this.listHistoric = this.historicService.getHistoric();
    console.log(this.listHistoric)
    this.listHistoricBase = this.listHistoric;
  }

  setFilteredItems(searchTerm) {

    if (!searchTerm) {
      return this.listHistoric = this.listHistoricBase;
    }

    this.listHistoric = this.listHistoricBase
      .pipe(
        map(listHistoric => listHistoric.filter((filtering) => {
          if (filtering.time && searchTerm) {
            return filtering.time.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
          }
        }))
      );
  }
}
