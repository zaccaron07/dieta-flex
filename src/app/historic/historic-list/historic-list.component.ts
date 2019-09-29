import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { HistoricData } from '../historic.model';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HistoricService } from '../historic.service';

@Component({
  selector: 'app-historic-list',
  templateUrl: './historic-list.component.html',
})
export class HistoricListComponent implements OnInit {

  public searchControl: FormControl;
  public listHistoric: HistoricData[]
  public listHistoricBase: HistoricData[]
  private subscription: Subscription

  constructor(
    private historicService: HistoricService,
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

  openEditHistoric(Historic: HistoricData) {
    this.router.navigate(['historic-list/historic-add', Historic])
  }

  openRemoveHistoric(historic: HistoricData) {
    this.historicService.deleteHistoric(historic.id)
  }

  getListHistoric() {
    this.subscription = this.historicService.getHistoric().subscribe((historicData) => {
      this.listHistoric = historicData.sort((a, b) => b.timeOrderBy.getDate() - a.timeOrderBy.getDate())
      this.listHistoricBase = this.listHistoric
    })
  }

  setFilteredItems(searchTerm) {
    if (!searchTerm) {
      return this.listHistoric = this.listHistoricBase;
    }

    this.listHistoric = this.listHistoricBase.filter((filtering) => {
      if (filtering.time && searchTerm) {
        return filtering.time.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
      }
    })
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe()
  }

  ionViewWillEnter() {
    this.getListHistoric();
  }
}
