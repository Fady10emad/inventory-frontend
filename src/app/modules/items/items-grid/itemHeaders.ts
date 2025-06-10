import { ColDef } from 'ag-grid-community';
import { DiscountEnum } from '@app/shared/enums/Item';
import { ItemsGridControlComponent } from './items-grid-control/items-grid-control.component';

export const itemHeaders: ColDef[] = [
  { headerName: 'كود', field: 'code' },
  { headerName: 'الباركود', field: 'barCode' },
  { headerName: 'الوصف العربي', field: 'descriptionAr' },
  { headerName: 'بلد المنشأ', field: 'originCountry' },
  {
    headerName: 'تعديل ',
    colId: 'action',
    cellRenderer: ItemsGridControlComponent,
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
    cellRenderer: ItemsGridControlComponent,
    cellRendererParams: {
      showEdit: false,
      showDelete: true,
    },
    // pinned: 'left',
    maxWidth: 80,
  },
];
