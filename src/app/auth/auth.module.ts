import { NgModule } from "@angular/core";
import { SignupComponent } from "./signup/signup.component";
import { LoginComponent } from "./login/login.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { AuthRoutingModule } from "./auth-routing.module";
import { AngularFireAuthModule } from '@angular/fire/auth';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@NgModule({
    declarations: [
        SignupComponent,
        LoginComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        IonicModule.forRoot(),
        ReactiveFormsModule,
        AngularFireAuthModule,
        AuthRoutingModule
    ],
    providers: [
        GooglePlus
    ]
})
export class AuthModule {

}