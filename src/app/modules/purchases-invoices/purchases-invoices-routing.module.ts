import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { appRoutes } from '@app/shared/routers/appRouters';
import { AddPurchaseInvoiceComponent } from './add-purchase-invoice/add-purchase-invoice.component';
import { PurchaseInvoiceGridComponent } from './purchase-invoice-grid/purchase-invoice-grid.component';

const routes: Routes = [
  {
    path:appRoutes.purchasesInvoice.create,
    component: AddPurchaseInvoiceComponent
  },
  {
    path:appRoutes.purchasesInvoice.editById,
    component: AddPurchaseInvoiceComponent
  },
  {
    path:appRoutes.purchasesInvoice.grid,
    component: PurchaseInvoiceGridComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasesInvoicesRoutingModule { }
