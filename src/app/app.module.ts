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
import { ContactComponent } from './contact/contact.component';
import { DietDetailComponent } from './diet/diet-detail/diet-detail.component';
import { TipsAddComponent } from './tips/tips-add/tips-add.component';
import { FoodComponent } from './food/food.component';
import { TipsListComponent } from './tips/tips-list/tips-list.component';
import { ContactService } from './contact/contact.service';
import { MyContactsComponent } from './my-contacts/my-contacts.component';
import { FoodListComponent } from './food/food-list/food-list.component';
import { DietModalComponent } from './diet/diet-modal/diet-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    UserProfileComponent,
    NotificationComponent,
    DietComponent,
    ContactComponent,
    DietDetailComponent,
    TipsAddComponent,
    TipsListComponent,
    FoodComponent,
    MyContactsComponent,
    FoodListComponent,
    DietModalComponent
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
    ContactService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
