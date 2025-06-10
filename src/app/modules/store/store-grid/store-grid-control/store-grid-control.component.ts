import { Component } from '@angular/core';
import { ICellRendererParams, IGetRowsParams } from 'ag-grid-community';

import { Router } from '@angular/router';
import { MessagesService } from '@app/shared/service/messages.service';
import { appRoutes } from '@app/shared/routers/appRouters';
import { ItemsService } from '@app/shared/service/items.service';
import { StoreGridComponent } from '../store-grid.component';
import { StoreService } from '@app/shared/service/store.service';

@Component({
  selector: 'app-store-grid-control',
  templateUrl: './store-grid-control.component.html',
  styleUrls: ['./store-grid-control.component.scss'],
})
export class StoreGridControlComponent {
  public params!: ICellRendererParams & { showEdit: boolean; showDelete: boolean };
  private comp!: StoreGridComponent;

  constructor(
    private messagesService: MessagesService,
    private router: Router,
    private itemsService: ItemsService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {}

  agInit(params: ICellRendererParams & { showEdit: boolean; showDelete: boolean }) {
    this.params = params;
    this.comp = this.params.context.comp;
  }

  editItem() {
    const id = this.params.data.id;
    this.router.navigate([`${appRoutes.store.base}/${appRoutes.store.edit}/${id}`]);
  }

  deleteCategory(id: string) {
    this.messagesService
      .templateComfirmation('هل متأكد من حذف هذا المخزن ؟', '', 'موافق', 'الغاء', 'error')
      .then((result) => {
        if (result.isConfirmed) {
          this.storeService.deleteStore(this.params.data.id).subscribe((res) => {
            if (res.isSuccess) {
              this.comp.dataSource = {
                getRows: (params: IGetRowsParams) => {
                  this.comp.gridApi.showLoadingOverlay();
                  this.comp.fetchDataAndLoadItems(params);
                },
              };
              this.comp.gridApi.setGridOption('datasource', this.comp.dataSource);
              this.messagesService.toast('تم الحذف بنجاح', 'success');
            } else {
              this.messagesService.toast(res.message, 'error');
            }
          });
        } else {
          return;
        }
      });
  }
}
