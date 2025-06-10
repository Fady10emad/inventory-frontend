import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { appRoutes } from '@app/shared/routers/appRouters';
import { AddOrIssueItemsRequestComponent } from './add-or-issue-items-request/add-or-issue-items-request.component';
import { StockItemsRequsitionGridComponent } from './stock-items-requsition-grid/stock-items-requsition-grid.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: appRoutes.stockItemsRequisition.addItemsRequestGrid,
    component: StockItemsRequsitionGridComponent,
    data: { addOrIssue: appRoutes.stockItemsRequisition.addItemsRequestGrid },
  },
  {
    path: appRoutes.stockItemsRequisition.issueItemsRequestGrid,
    component: StockItemsRequsitionGridComponent,
    data: { addOrIssue: appRoutes.stockItemsRequisition.issueItemsRequestGrid },
  },
  {
    path: appRoutes.stockItemsRequisition.addItemsRequest,
    component: AddOrIssueItemsRequestComponent,
    data: { addOrIssue: appRoutes.stockItemsRequisition.addItemsRequest },
  },
  {
    path: appRoutes.stockItemsRequisition.issueItemsRequest,
    component: AddOrIssueItemsRequestComponent,
    data: { addOrIssue: appRoutes.stockItemsRequisition.issueItemsRequest },
  },
  {
    path: `${appRoutes.stockItemsRequisition.editAddItemsRequest}/:id`,
    component: AddOrIssueItemsRequestComponent,
    data: { isEdit: true, addOrIssue: appRoutes.stockItemsRequisition.addItemsRequest },
  },
  {
    path: `${appRoutes.stockItemsRequisition.editIssueItemsRequest}/:id`,
    component: AddOrIssueItemsRequestComponent,
    data: { isEdit: true, addOrIssue: appRoutes.stockItemsRequisition.issueItemsRequest },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockItemsRequisitionRoutingModule {}
