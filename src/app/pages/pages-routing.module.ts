import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { PropriedadesComponent } from './propriedades/propriedades.component';
import { TipoItemListComponent } from './tipo-item-list/tipo-item-list.component';
import { RegisterTipoItemComponent } from './register-tipo-item/register-tipo-item.component';
import { UpdateTipoItemComponent } from './update-tipo-item/update-tipo-item.component';
import { ProprietarioComponent } from './proprietario/proprietario.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from '../core/guard/auth.guard';
import { listGuard } from '../core/permissionGuard/list.guard';
import { EdificioComponent } from './edificio/edificio.component';

const routes: Routes = [
  {
    path: "", 
    pathMatch: "full", 
    redirectTo: "login"
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "user",
    canActivate: [AuthGuard, listGuard],
    component: UserComponent
  },
  {
    path: "proprietario",
    canActivate: [AuthGuard, listGuard],
    component: ProprietarioComponent
  },
  {
    path: "propriedades",
    canActivate: [AuthGuard, listGuard],
    component: PropriedadesComponent
  },
  {
    path: "edificios/:prop_id",
    // canActivate: [AuthGuard, listGuard],
    component: EdificioComponent
  },
  {
    path: "tipo-item-list",
    canActivate: [AuthGuard, listGuard],
    component: TipoItemListComponent
  },
  {
    path: "register-tipo-item",
    canActivate: [AuthGuard, listGuard],
    component: RegisterTipoItemComponent
  },
  {
    path: "update-tipo-item/:tipo_item_id",
    canActivate: [AuthGuard, listGuard],
    component: UpdateTipoItemComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }