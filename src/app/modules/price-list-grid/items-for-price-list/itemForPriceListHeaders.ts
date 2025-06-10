import { ColDef } from 'ag-grid-community';
import { DiscountEnum } from '@app/shared/enums/Item';
// import { ItemsGridControlComponent } from './items-grid-control/items-grid-control.component';

export const itemForBriceListHeaders: ColDef[] = [
  // {
  //   colId: 'action',
  //   // cellRenderer: ItemsGridControlComponent,
  //   pinned: 'left',
  //   minWidth: 250,
  //   sortable: false,
  // },
  // { headerName: 'id', field: 'id' },
  { headerName: 'كود', field: 'id' },
  { headerName: 'اسم المنتج', field: 'itemName' },
  { headerName: 'الوصف', field: 'priceListDescription' },
  { headerName: 'السعر', field: 'price' },
];
