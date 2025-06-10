import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { appRoutes } from '@app/shared/routers/appRouters';
import { AddPriceListComponent } from './add-price-list/add-price-list.component';
import { PriceListComponent } from './price-list/price-list.component';
import { ItemsForPriceListComponent } from './items-for-price-list/items-for-price-list.component';

const routes: Routes = [
  {
    path: appRoutes.priceList.addPriceList,
    component: AddPriceListComponent,
  },
  {
    path: appRoutes.priceList.grid,
    component: PriceListComponent,
  },
  {
    path: appRoutes.priceList.priceListItemsById,
    component: ItemsForPriceListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriceListGridRoutingModule { }
