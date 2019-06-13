import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { NumericValueAccessor } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-historic-list',
  templateUrl: './historic-list.component.html',
  styleUrls: ['./historic-list.component.scss'],
})
export class HistoricListComponent implements OnInit {

  constructor(private afFirestore: AngularFirestore, private authService: AuthService) { }

  listFood: Observable<any[]>
  
  ngOnInit() {
    this.listFood = this.getFood();
  } 
  
  getFood() {
    let lUserID = this.authService.getUser().id;
    return this.afFirestore.collection('user/' + lUserID + "/historic").valueChanges();
  }
}
