import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRoutingModule } from './store-routing.module';
import { AddStoreComponent } from './add-store/add-store.component';
import { SharedModule } from '@app/shared/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { StoreGridComponent } from './store-grid/store-grid.component';
import { StoreGridControlComponent } from './store-grid/store-grid-control/store-grid-control.component';
import { StoreEditComponent } from './components/store-edit/store-edit.component';
import { DisburseOrAddMovementComponent } from './disburse-or-add-movement/disburse-or-add-movement.component';
import { AddStockOfItemsComponent } from './components/add-stock-of-items/add-stock-of-items.component';

@NgModule({
  declarations: [
    AddStoreComponent,
    StoreGridComponent,
    StoreGridControlComponent,
    StoreEditComponent,
    AddStockOfItemsComponent,
  ],
  imports: [CommonModule, StoreRoutingModule, SharedModule, AgGridModule],
})
export class StoreModule {}
