import { ColDef } from 'ag-grid-community';
import { DismissalNoticeGridControlComponent } from './dismissal-notice-grid-control/dismissal-notice-grid-control.component';

export const dismissalNoticeHeaders: ColDef[] = [
  // {
  //   colId: 'action',
  //   cellRenderer: DismissalNoticeGridControlComponent,
  //   pinned: 'left',
  //   maxWidth: 120,
  // },
  { headerName: 'رقم الإذن', field: 'id' },
  {
    headerName: 'من مخزن',
    field: 'fromStore.description',
  },
  {
    headerName: 'الى مخزن',
    field: 'toStore.description',
  },
  {
    headerName: 'رقم طلب الصرف',
    field: 'exchangeOrderNumber',
  },
  {
    headerName: 'رقم طلب الأضافة',
    field: 'additionRequestNumber',
  },
  {
    headerName: 'تم الترحيل',
    field: 'isPosted',
    valueFormatter: (params) => {
      return params.value === true ? 'تم الترحيل' : 'لم يتم الترحيل';
    },
  },
  {
    headerName: 'تعديل ',
    colId: 'action',
    cellRenderer: DismissalNoticeGridControlComponent,
    cellRendererParams: {
      showEdit: true,
      showDelete: false,
    },

    // pinned: 'left',
    maxWidth: 80,
  },
  {
    headerName: 'حذف',
    colId: 'action',
    cellRenderer: DismissalNoticeGridControlComponent,
    cellRendererParams: {
      showEdit: false,
      showDelete: true,
    },
    // pinned: 'left',
    maxWidth: 80,
  },
];
