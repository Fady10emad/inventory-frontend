import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemsRoutingModule } from './items-routing.module';
import { AddItemComponent } from './add-item/add-item.component';
import { SharedModule } from '@app/shared/shared.module';
import { ItemsGridComponent } from './items-grid/items-grid.component';
import { EditItemsComponent } from './edit-items/edit-items.component';
import { GridModule, PageService, SortService, FilterService } from '@syncfusion/ej2-angular-grids';
import { ViewItemStockComponent } from './view-item-stock/view-item-stock.component';
import { AddItemPricesComponent } from './add-item-prices/add-item-prices.component';
import { AgGridModule } from 'ag-grid-angular';
import { ItemsGridControlComponent } from './items-grid/items-grid-control/items-grid-control.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    AddItemComponent,
    ItemsGridComponent,
    EditItemsComponent,
    ViewItemStockComponent,
    AddItemPricesComponent,
    ItemsGridControlComponent,
  ],
  imports: [CommonModule, ItemsRoutingModule, SharedModule, GridModule, AgGridModule, NgbNavModule],
  providers: [PageService, SortService, FilterService],
})
export class ItemsModule {}
