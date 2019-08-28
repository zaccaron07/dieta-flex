import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { UserProfileComponent } from './user-profile/user-profile-add/user-profile.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { DietComponent } from './diet/diet.component';
import { TipsAddComponent } from './tips/tips-add/tips-add.component';
import { FoodComponent } from './food/food-add/food.component';
import { TipsListComponent } from './tips/tips-list/tips-list.component';
import { FoodListComponent } from './food/food-list/food-list.component';
import { DietModalComponent } from './diet/diet-modal/diet-modal.component';
import { HistoricListComponent } from './historic/historic-list/historic-list.component';
import { HistoricAddComponent } from './historic/historic-add/historic-add.component';

@NgModule({
  declarations: [
    AppComponent,
    UserProfileComponent,
    NotificationComponent,
    DietComponent,
    TipsAddComponent,
    TipsListComponent,
    FoodComponent,
    FoodListComponent,
    DietModalComponent,
    HistoricListComponent,
    HistoricAddComponent
  ],
  entryComponents: [DietModalComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    BrowserModule,
    IonicModule.forRoot(),
    CommonModule,
    AppRoutingModule,
    AngularFireAuthModule,
    AuthModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
