import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { appRoutes } from '@app/shared/routers/appRouters';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { VendorGridComponent } from './vendor-grid/vendor-grid.component';

const routes: Routes = [
  {
    path: appRoutes.vendor.add,
    component: AddVendorComponent,
  },
  {
    path: appRoutes.vendor.viewById,
    component: AddVendorComponent,
  },
  {
    path: appRoutes.vendor.editById,
    component: AddVendorComponent,
  },
  {
    path: appRoutes.vendor.grid,
    component: VendorGridComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorsRoutingModule {}
