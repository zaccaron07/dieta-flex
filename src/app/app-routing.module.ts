import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { UserProfileComponent } from './user-profile/user-profile-add/user-profile.component';
import { NotificationComponent } from './notification/notification.component';
import { DietComponent } from './diet/diet.component';
import { ContactComponent } from './contact/contact.component';
import { DietDetailComponent } from './diet/diet-detail/diet-detail.component';
import { TipsAddComponent } from './tips/tips-add/tips-add.component';
import { FoodComponent } from './food/food.component';
import { TipsListComponent } from './tips/tips-list/tips-list.component';
import { MyContactsComponent } from './my-contacts/my-contacts.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule', canActivate: [AuthGuard] },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'tips-list/tips-add', component: TipsAddComponent, canActivate: [AuthGuard] },
  { path: 'tips-list', component: TipsListComponent, canActivate: [AuthGuard] },
  { path: 'notification', component: NotificationComponent, canActivate: [AuthGuard] },
  { path: 'diet', component: DietComponent, canActivate: [AuthGuard] },
  { path: 'diet/dietDetail', component: DietDetailComponent, canActivate: [AuthGuard] },
  { path: 'mycontacts/contact', component: ContactComponent, canActivate: [AuthGuard] },
  { path: 'food', component: FoodComponent, canActivate: [AuthGuard] },
  { path: 'mycontacts', component: MyContactsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [
    AuthGuard
  ]
})
export class AppRoutingModule { }