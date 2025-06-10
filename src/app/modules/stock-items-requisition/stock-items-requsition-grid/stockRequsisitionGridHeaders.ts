import { ColDef } from 'ag-grid-community';
import { StockItemsRequsitionGridControlComponent } from './stock-items-requsition-grid-control/stock-items-requsition-grid-control.component';

export const stockItemsRequsitionGridHeaders: ColDef[] = [
  // {
  //   colId: 'action',
  //   cellRenderer: StockItemsRequsitionGridControlComponent,
  //   pinned: 'left',
  //   maxWidth: 120,
  // },
  { headerName: 'كود', field: 'code' },
  {
    headerName: 'نوع الحركة',
    field: 'transactionType',
    valueFormatter: (params) => {
      return params.value === 1 ? 'صرف' : 'اضافة';
    },
  },
  { headerName: 'رقم الملف', field: 'fileNumber' },
  { headerName: 'رقم المخزن', field: 'storeId' },
  { headerName: 'المنطقة', field: 'agency' },
  { headerName: 'المستلم', field: 'receiver' },
  {
    headerName: 'تعديل ',
    colId: 'action',
    cellRenderer: StockItemsRequsitionGridControlComponent,
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
    cellRenderer: StockItemsRequsitionGridControlComponent,
    cellRendererParams: {
      showEdit: false,
      showDelete: true,
    },
    // pinned: 'left',
    maxWidth: 90,
  },
];
