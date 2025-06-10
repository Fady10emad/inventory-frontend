import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddItemComponent } from './add-item/add-item.component';
import { appRoutes } from '@app/shared/routers/appRouters';

import { ItemsGridComponent } from './items-grid/items-grid.component';
import { EditItemsComponent } from './edit-items/edit-items.component';
import { ViewItemStockComponent } from './view-item-stock/view-item-stock.component';
import { AddItemPricesComponent } from './add-item-prices/add-item-prices.component';
import { PermissonToMoveItemsComponent } from './permisson-to-move-items/permisson-to-move-items.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: appRoutes.items.grid,
    pathMatch: 'full',
  },
  {
    path: appRoutes.items.create,
    component: AddItemComponent,
  },
  {
    path: appRoutes.items.grid,
    component: ItemsGridComponent,
  },
  {
    path: `${appRoutes.items.addItemPrices}/:itemId`,
    component: AddItemPricesComponent,
  },
  {
    path: `${appRoutes.items.edit}/:itemId`,
    component: EditItemsComponent,
  },
  {
    path: `${appRoutes.items.viewStock}/:itemId`,
    component: ViewItemStockComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemsRoutingModule {}
