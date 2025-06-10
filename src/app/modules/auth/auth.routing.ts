import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './page/login/login.component';
import { RegisterComponent } from './page/register/register.component';
import { appRoutes } from '@app/shared/routers/appRouters';

const routes: Routes = [
  {
    path: '',
    redirectTo: `${appRoutes.auth.base}/${appRoutes.auth.login}`,
    pathMatch: 'full',
  },
  {
    path: '',
    children: [
      {
        path: appRoutes.auth.login,
        component: LoginComponent,
      },
      {
        path: appRoutes.auth.register,
        component: RegisterComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
