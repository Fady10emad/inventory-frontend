import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PriceListGridRoutingModule } from './price-list-grid-routing.module';
import { AddPriceListComponent } from './add-price-list/add-price-list.component';
import { SharedModule } from '@app/shared/shared.module';
import { PriceListComponent } from './price-list/price-list.component';
import { GridModule, PageService, SortService, FilterService } from '@syncfusion/ej2-angular-grids';
import { ItemsForPriceListComponent } from './items-for-price-list/items-for-price-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormGroup } from '@angular/forms';



@NgModule({
  declarations: [
    AddPriceListComponent,
    PriceListComponent,
    ItemsForPriceListComponent
  ],
  imports: [
    CommonModule,
    PriceListGridRoutingModule,
    SharedModule,
    GridModule,
    AgGridModule,
    
  ],
  providers: [PageService, SortService, FilterService],

})
export class PriceListGridModule { }
