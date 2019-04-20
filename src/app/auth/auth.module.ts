import { NgModule } from "@angular/core";
import { SignupComponent } from "./signup/signup.component";
import { LoginComponent } from "./login/login.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { AuthRoutingModule } from "./auth-routing.module";
import { AngularFireAuthModule } from '@angular/fire/auth';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [
        SignupComponent,
        LoginComponent
    ],
    imports: [
        FormsModule,
        IonicModule.forRoot(),
        ReactiveFormsModule,
        AngularFireAuthModule,
        AuthRoutingModule
    ],
    exports: []
})
export class AuthModule {

}