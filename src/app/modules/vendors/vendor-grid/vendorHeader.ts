import { ColDef } from 'ag-grid-community';

import { VendorGridControlsComponent } from './vendor-grid-controls/vendor-grid-controls.component';

export const vendorHeaders: ColDef[] = [
  // {
  //   colId: 'action',
  //   cellRenderer: VendorGridControlsComponent,
  //   pinned: 'left',
  //   maxWidth: 150,
  // },
  { headerName: 'كود', field: 'code' },
  { headerName: 'الاسم', field: 'name' },
  { headerName: 'الوصف العربي', field: 'descriptionAr' },
  { headerName: 'المسئول', field: 'responsible' },
  { headerName: 'التليفون', field: 'phone' },
  { headerName: ' الايميل', field: 'email' },
  { headerName: ' العنوان', field: 'address' },
  {
    headerName: 'تعديل ',
    colId: 'action',
    cellRenderer: VendorGridControlsComponent,
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
    cellRenderer: VendorGridControlsComponent,
    cellRendererParams: {
      showEdit: false,
      showDelete: true,
    },
    // pinned: 'left',
    maxWidth: 80,
  },
  // { headerName: ' رقم المنطقة', field: 'areaId' },
  // { headerName: 'العملة ', field: 'currencyId' },
  // { headerName: 'رقم المجموعة', field: 'providerCategoryId' },
  // { headerName: 'المامورية المختصة', field: 'competentoffice' },

  // {
  //   headerName: 'الخصم',
  //   field: 'areaId',
  //   valueFormatter: (params) => {
  //     return params.value === DiscountEnum.Yes ? 'نعم' : 'لا';
  //   }
  // },
  // },
  // { headerName: 'رقم التسجيل الضريبي', field: 'taxRegistrationNumber' },
  // { headerName: 'رقم الملف الضريبي', field: 'taxFileNumber' },
  // { headerName: 'ضريبة خصم الاصناف', field: 'discountTaxItems' },
  // { headerName: 'ضريبة خصم الخدمات', field: 'discountTaxServices' },
  // { headerName: 'ضريبة اضافة للاصناف', field: 'valueAddedTaxItems' },
  // { headerName: ' ضريبة اضافة للخدمات', field: 'valueAddedTaxServices' },
  // { headerName: 'اقفال التعامل', field: 'closeDealings' },
  // { headerName: 'طريقة السداد', field: 'paymentMethod' },
  // { headerName: 'خصم المورد', field: 'providerDiscount' },
  // { headerName: 'فترة السداد', field: 'paymentPeriod' },
];
