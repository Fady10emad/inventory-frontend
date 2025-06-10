import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchasesInvoicesRoutingModule } from './purchases-invoices-routing.module';
import { AddPurchaseInvoiceComponent } from './add-purchase-invoice/add-purchase-invoice.component';
import { PurchaseInvoiceGridComponent } from './purchase-invoice-grid/purchase-invoice-grid.component';
import { SharedModule } from '@app/shared/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { PurchaseInvoiceControlsComponent } from './purchase-invoice-grid/purchase-invoice-controls/purchase-invoice-controls.component';
import { ConfirmModalComponent } from './add-purchase-invoice/confirm-modal.component';

@NgModule({
  declarations: [
    AddPurchaseInvoiceComponent,
    PurchaseInvoiceGridComponent,
    PurchaseInvoiceControlsComponent,
    ConfirmModalComponent 
  ],
  imports: [

  CommonModule,
    PurchasesInvoicesRoutingModule,
    SharedModule, 
    AgGridModule
  ]
})
export class PurchasesInvoicesModule { }
