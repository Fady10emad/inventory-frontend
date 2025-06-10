import { ColDef } from 'ag-grid-community';
import { DisburseOrAddMovementGridControlsComponent } from './disburse-or-add-movement-grid-controls/disburse-or-add-movement-grid-controls.component';
import { PurchaseInvoiceControlsComponent } from './purchase-invoice-controls/purchase-invoice-controls.component';

export const purchaseInvoiceHeaders: ColDef[] = [
  // {
  //   colId: 'action',
  //   cellRenderer: PurchaseInvoiceControlsComponent,
  //   pinned: 'left',
  //   maxWidth: 200,
  // },
  { headerName: 'رقم المستند', field: 'documentNo' },
  { headerName: 'رقم فاتوره المورد', field: 'providerInvoiceNo' },
  { headerName: 'رقم امر التوريد', field: 'supplyOrderNo' },
  { headerName: 'ملاحظات', field: 'notes' },
  { headerName: 'تاريخ الفاتورة', field: 'invoiceDate' },
  { headerName: 'قيمة البضاعة', field: 'total_Value_Items' },
  { headerName: 'الخدمات', field: 'total_Value_Services' },
  { headerName: 'صافي الفاتورة', field: 'netInvoice' },
  {
    headerName: 'طريقة الدفع',
    field: 'paymentMethod',
    valueFormatter: (params) => {
      return params.value === 2 ? 'نقدا' : 'اجل';
    },
  },
  {
    headerName: 'تعديل ',
    colId: 'action',
    cellRenderer: PurchaseInvoiceControlsComponent,
    cellRendererParams: {
      showEdit: true,
      showDelete: false,
    },

    // pinned: 'left',
    maxWidth: 120,
  },
  {
    headerName: 'حذف',
    colId: 'action',
    cellRenderer: PurchaseInvoiceControlsComponent,
    cellRendererParams: {
      showEdit: false,
      showDelete: true,
    },
    // pinned: 'left',
    maxWidth: 120,
  },
];
