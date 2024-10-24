import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FormHostComponent } from './form-host/form-host.component';
import { PerfilComponent } from './perfil/perfil.component';

export const routes: Routes = [
      { path: 'home'       , component: HomeComponent     }
    , { path: 'login'      , component: LoginComponent    }
    , { path: 'tornar-host', component: FormHostComponent }
    , { path: 'perfil'     , component: PerfilComponent   }
    , { path: '', redirectTo: 'home', pathMatch: 'full'   }
    , { path: '**', redirectTo: 'home'                    }
];
