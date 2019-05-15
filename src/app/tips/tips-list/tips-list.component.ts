import { Component, OnInit } from '@angular/core';
import { TipsService } from '../tips.service';
import { Observable } from 'rxjs';
import { TipsData } from '../tips-data.model';

@Component({
  selector: 'app-tips-list',
  templateUrl: './tips-list.component.html',
  styleUrls: ['./tips-list.component.scss'],
})
export class TipsListComponent implements OnInit {

  listTips: Observable<any[]>

  constructor(
    private tipsService: TipsService
  ) { }

  ngOnInit() {
    this.getListTips();
  }

  openEditTips(aTips: TipsData){
    //-- open page with the dados
  }
  
  getListTips(){
    this.listTips = this.tipsService.getTips();
  }

}
