import { ColDef } from 'ag-grid-community';
import { DisburseOrAddMovementGridControlsComponent } from './disburse-or-add-movement-grid-controls/disburse-or-add-movement-grid-controls.component';

export const transactionHeaders: ColDef[] = [
  // {
  //   colId: 'action',
  //   cellRenderer: DisburseOrAddMovementGridControlsComponent,
  //   pinned: 'left',
  //   maxWidth: 150,
  // },
  { headerName: 'كود', field: 'code' },
  {
    headerName: 'نوع الحركة',
    field: 'transactionType',
    valueFormatter: (params) => {
      return params.value === 1 ? 'صرف' : 'اضافة';
    },
  },
  { headerName: 'حساب المدين', field: 'debitAccount' },
  { headerName: 'حساب الدائن', field: 'creditAccount' },
  { headerName: 'مركز التكلفة', field: 'costCenter' },
  { headerName: 'الوصف', field: 'description' },
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
    cellRenderer: DisburseOrAddMovementGridControlsComponent,
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
    cellRenderer: DisburseOrAddMovementGridControlsComponent,
    cellRendererParams: {
      showEdit: false,
      showDelete: true,
    },
    // pinned: 'left',
    maxWidth: 80,
  },
];
