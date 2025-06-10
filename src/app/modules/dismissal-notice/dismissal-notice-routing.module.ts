import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { appRoutes } from '@app/shared/routers/appRouters';
import { DismissalNoticeGridComponent } from './dismissal-notice-grid/dismissal-notice-grid.component';
import { PermissonToMoveItemsComponent } from './permisson-to-move-items/permisson-to-move-items.component';
import { DisburseOrAddMovementComponent } from './disburse-or-add-movement/disburse-or-add-movement.component';
import { DisburseOrAddMovementGridComponent } from './disburse-or-add-movement-grid/disburse-or-add-movement-grid.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: appRoutes.dismissalNotice.grid,
    component: DismissalNoticeGridComponent,
  },
  {
    path: appRoutes.dismissalNotice.create,
    component: PermissonToMoveItemsComponent,
  },
  {
    path: appRoutes.dismissalNotice.editById,
    component: PermissonToMoveItemsComponent,
  },
  {
    path: `${appRoutes.dismissalNotice.disburseOrAddBase}/${appRoutes.dismissalNotice.disburseOrAddCreate}`,
    component: DisburseOrAddMovementComponent,
  },
  {
    path: `${appRoutes.dismissalNotice.disburseOrAddBase}/${appRoutes.dismissalNotice.disburseOrAddEditById}`,
    component: DisburseOrAddMovementComponent,
  },
  {
    path: `${appRoutes.dismissalNotice.disburseOrAddBase}/${appRoutes.dismissalNotice.disburseOrAddGrid}`,
    component: DisburseOrAddMovementGridComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DismissalNoticeRoutingModule {}
