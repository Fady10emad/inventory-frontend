import { ColDef } from 'ag-grid-community';
import { DiscountEnum } from '@app/shared/enums/Item';
import { StoreGridControlComponent } from './store-grid-control/store-grid-control.component';

export const storeHeaders: ColDef[] = [
  // {
  //   colId: 'action',
  //   cellRenderer: StoreGridControlComponent,
  //   pinned: 'left',
  //   maxWidth: 120,
  // },
  { headerName: 'كود', field: 'code' },
  { headerName: 'وصف المخزن', field: 'description' },
  { headerName: 'الموقع', field: 'location' },
  { headerName: 'المسئول', field: 'responsible' },
  { headerName: 'رقم الاتصال', field: 'phone' },
  // {
  //   headerName: 'الخصم',
  //   field: 'discount',
  //   valueFormatter: (params) => {
  //     return params.value === DiscountEnum.Yes ? 'نعم' : 'لا';
  //   },
  // },
  {
    headerName: 'تعديل ',
    colId: 'action',
    cellRenderer: StoreGridControlComponent,
    cellRendererParams: {
      showEdit: true,
      showDelete: false,
    },

    // pinned: 'left',
    maxWidth: 90,
  },
  {
    headerName: 'حذف',
    colId: 'action',
    cellRenderer: StoreGridControlComponent,
    cellRendererParams: {
      showEdit: false,
      showDelete: true,
    },
    // pinned: 'left',
    maxWidth: 90,
  },
];
