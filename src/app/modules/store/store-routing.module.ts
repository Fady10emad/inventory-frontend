import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { appRoutes } from '@app/shared/routers/appRouters';
import { AddStoreComponent } from './add-store/add-store.component';
import { StoreGridComponent } from './store-grid/store-grid.component';
import { StoreEditComponent } from './components/store-edit/store-edit.component';
import { DisburseOrAddMovementComponent } from './disburse-or-add-movement/disburse-or-add-movement.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: appRoutes.store.addStore,
    component: AddStoreComponent,
  },
  {
    path: appRoutes.store.grid,
    component: StoreGridComponent,
  },
  {
    path: `${appRoutes.store.edit}/:id`,
    component: StoreEditComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreRoutingModule {}
