import { Component } from '@angular/core';
import { PurchaseInvoiceGridComponent } from '../purchase-invoice-grid.component';
import { Router } from '@angular/router';
import { appRoutes } from '@app/shared/routers/appRouters';
import { DismissalNoticeService } from '@app/shared/service/dismissal-notice.service';
import { MessagesService } from '@app/shared/service/messages.service';
import { ICellRendererParams, IGetRowsParams } from 'ag-grid-community';
import { PurchaseInvoiceService } from '@app/shared/service/purchase-invoice.service';

@Component({
  selector: 'app-purchase-invoice-controls',
  templateUrl: './purchase-invoice-controls.component.html',
  styleUrls: ['./purchase-invoice-controls.component.scss'],
})
export class PurchaseInvoiceControlsComponent {
  public params!: ICellRendererParams & { showEdit: boolean; showDelete: boolean };
  private comp!: PurchaseInvoiceGridComponent;

  constructor(
    private messagesService: MessagesService,
    private router: Router,
    private purchaseInvoiceService: PurchaseInvoiceService
  ) {}

  ngOnInit(): void {}

  agInit(params: ICellRendererParams & { showEdit: boolean; showDelete: boolean }) {
    this.params = params;
    this.comp = this.params.context.comp;
  }

  editPurchaseInvoice() {
    const id = this.params.data.id;
    this.router.navigate([
      `${appRoutes.purchasesInvoice.base}/${appRoutes.purchasesInvoice.edit}/${id}`,
    ]);
  }
  deletePurchaseInvoice(id: string) {
    this.messagesService
      .templateComfirmation('هل متأكد من حذف هذه الفاتورة؟', '', 'موافق', 'الغاء', 'error')
      .then((result) => {
        if (result.isConfirmed) {
          this.purchaseInvoiceService
            .deletePurchaseInvoice(this.params.data.id)
            .subscribe((res) => {
              this.comp.dataSource = {
                getRows: (params: IGetRowsParams) => {
                  this.comp.gridApi.showLoadingOverlay();
                  this.comp.fetchDataAndLoadPurchaseInvoice(params);
                },
              };
              this.comp.gridApi.setDatasource(this.comp.dataSource);
            });
        } else {
          return;
        }
      });
  }
}
