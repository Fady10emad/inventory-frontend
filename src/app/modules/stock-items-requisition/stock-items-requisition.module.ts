import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockItemsRequisitionRoutingModule } from './stock-items-requisition-routing.module';
import { AddOrIssueItemsRequestComponent } from './add-or-issue-items-request/add-or-issue-items-request.component';
import { SharedModule } from '@app/shared/shared.module';
import { StockItemsRequsitionGridComponent } from './stock-items-requsition-grid/stock-items-requsition-grid.component';
import { StockItemsRequsitionGridControlComponent } from './stock-items-requsition-grid/stock-items-requsition-grid-control/stock-items-requsition-grid-control.component';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    AddOrIssueItemsRequestComponent,
    StockItemsRequsitionGridComponent,
    StockItemsRequsitionGridControlComponent,
  ],
  imports: [CommonModule, SharedModule, StockItemsRequisitionRoutingModule, AgGridModule],
})
export class StockItemsRequisitionModule {}
