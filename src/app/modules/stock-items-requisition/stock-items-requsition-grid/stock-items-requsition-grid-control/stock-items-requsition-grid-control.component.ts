import { Component, ViewEncapsulation } from '@angular/core';
import { ICellRendererParams, IGetRowsParams } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';

import { appRoutes } from '@app/shared/routers/appRouters';
import { MessagesService } from '@app/shared/service/messages.service';
import { ItemsService } from '@app/shared/service/items.service';

import { StockItemsRequsitionGridComponent } from '../stock-items-requsition-grid.component';

@Component({
  selector: 'app-stock-items-requsition-grid-control',
  templateUrl: './stock-items-requsition-grid-control.component.html',
  styleUrls: ['./stock-items-requsition-grid-control.component.scss'],
})
export class StockItemsRequsitionGridControlComponent {
  public params!: ICellRendererParams & { showEdit: boolean; showDelete: boolean };
  private comp!: StockItemsRequsitionGridComponent;
  isAddRequest: boolean = false;
  constructor(
    private messagesService: MessagesService,
    private router: Router,
    private itemsService: ItemsService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data) => {
      this.isAddRequest =
        data['addOrIssue'] === appRoutes.stockItemsRequisition.addItemsRequestGrid;
    });
  }

  agInit(params: ICellRendererParams & { showEdit: boolean; showDelete: boolean }) {
    this.params = params;
    this.comp = this.params.context.comp;
  }

  editItem() {
    const id = this.params.data.id;
    const editUrl = this.isAddRequest
      ? `/${appRoutes.stockItemsRequisition.base}/${appRoutes.stockItemsRequisition.editAddItemsRequest}/${id}`
      : `/${appRoutes.stockItemsRequisition.base}/${appRoutes.stockItemsRequisition.editIssueItemsRequest}/${id}`;
    this.router.navigate([editUrl]);
  }

  deleteCategory(id: string) {
    // this.messagesService
    //   .templateComfirmation('هل متأكد من حذف هذا الصنف ؟', '', 'موافق', 'الغاء', 'error')
    //   .then((result) => {
    //     if (result.isConfirmed) {
    //       this.itemsService.deleteItem(this.params.data.id).subscribe((res) => {
    //         this.comp.dataSource = {
    //           getRows: (params: IGetRowsParams) => {
    //             this.comp.gridApi.showLoadingOverlay();
    //             this.comp.fetchDataAndLoadItems(params);
    //           },
    //         };
    //         this.comp.gridApi.setDatasource(this.comp.dataSource);
    //       });
    //     } else {
    //       return;
    //     }
    //   });
  }
}
