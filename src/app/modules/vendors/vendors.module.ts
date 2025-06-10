import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorsRoutingModule } from './vendors-routing.module';
import { VendorGridComponent } from './vendor-grid/vendor-grid.component';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { SharedModule } from '@app/shared/shared.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { AgGridModule } from 'ag-grid-angular';
import { AddProviderAreaComponent } from './add-vendor/add-provider-area/add-provider-area.component';
import { AddProviderCategoryComponent } from './add-vendor/add-provider-category/add-provider-category.component';
import { AddProviderCurrencyComponent } from './add-vendor/add-provider-currency/add-provider-currency.component';
import { VendorGridControlsComponent } from './vendor-grid/vendor-grid-controls/vendor-grid-controls.component';

@NgModule({
  declarations: [
    VendorGridComponent,
    AddVendorComponent,
    AddProviderAreaComponent,
    AddProviderCategoryComponent,
    AddProviderCurrencyComponent,
    VendorGridControlsComponent,
  ],
  imports: [
    CommonModule,
    VendorsRoutingModule,
    SharedModule,
    GridModule,
    AgGridModule,
    NgbNavModule,
  ],
})
export class VendorsModule {}
