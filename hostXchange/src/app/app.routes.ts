import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FormHostComponent } from './form-host/form-host.component';

export const routes: Routes = [
      { path: 'home'       , component: HomeComponent     }
    , { path: 'login'      , component: LoginComponent    }
    , { path: 'tornar-host', component: FormHostComponent }
];
