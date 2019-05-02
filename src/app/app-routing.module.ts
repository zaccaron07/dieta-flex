import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NotificationComponent } from './notification/notification.component';
import { DietComponent } from './diet/diet.component';
import { ContactComponent } from './contact/contact.component';
import { DietDetailComponent } from './diet/diet-detail/diet-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule', canActivate: [AuthGuard] },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'notification', component: NotificationComponent, canActivate: [AuthGuard] },
  { path: 'diet', component: DietComponent, canActivate: [AuthGuard] },
  { path: 'diet/dietDetail', component: DietDetailComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactComponent, canActivate: [AuthGuard] }
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