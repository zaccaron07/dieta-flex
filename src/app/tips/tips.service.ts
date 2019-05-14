import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TipsData } from './tips-data.model';

@Injectable({
  providedIn: 'root'
})
export class TipsService {

  constructor(private afFirestore: AngularFirestore) { }

  createTips(tipsData: TipsData) {
    return this.afFirestore.collection('tips').add(tipsData);
  }
}
