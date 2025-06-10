import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DismissalNoticeRoutingModule } from './dismissal-notice-routing.module';
import { DismissalNoticeGridComponent } from './dismissal-notice-grid/dismissal-notice-grid.component';
import { SharedModule } from '@app/shared/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { DismissalNoticeGridControlComponent } from './dismissal-notice-grid/dismissal-notice-grid-control/dismissal-notice-grid-control.component';
import { PermissonToMoveItemsComponent } from './permisson-to-move-items/permisson-to-move-items.component';
import { DisburseOrAddMovementComponent } from './disburse-or-add-movement/disburse-or-add-movement.component';
import { DisburseOrAddMovementGridComponent } from './disburse-or-add-movement-grid/disburse-or-add-movement-grid.component';
import { DisburseOrAddMovementGridControlsComponent } from './disburse-or-add-movement-grid/disburse-or-add-movement-grid-controls/disburse-or-add-movement-grid-controls.component';

@NgModule({
  declarations: [
    DismissalNoticeGridComponent,
    DismissalNoticeGridControlComponent,
    PermissonToMoveItemsComponent,
    DisburseOrAddMovementComponent,
    DisburseOrAddMovementGridComponent,
    DisburseOrAddMovementGridControlsComponent,
  ],
  imports: [CommonModule, DismissalNoticeRoutingModule, SharedModule, AgGridModule],
})
export class DismissalNoticeModule {}
