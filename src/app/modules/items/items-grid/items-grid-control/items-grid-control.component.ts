import { Component, ViewEncapsulation } from '@angular/core';
import { ICellRendererParams, IGetRowsParams } from 'ag-grid-community';
import { ItemsGridComponent } from '../items-grid.component';
import { Router } from '@angular/router';
import { MessagesService } from '@app/shared/service/messages.service';
import { appRoutes } from '@app/shared/routers/appRouters';
import { ItemsService } from '@app/shared/service/items.service';

@Component({
  selector: 'app-items-grid-control',
  templateUrl: './items-grid-control.component.html',
  styleUrls: ['./items-grid-control.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ItemsGridControlComponent {
  public params!: ICellRendererParams & { showEdit: boolean; showDelete: boolean };
  private comp!: ItemsGridComponent;

  constructor(
    private messagesService: MessagesService,
    private router: Router,
    private itemsService: ItemsService
  ) {}

  ngOnInit(): void {}

  agInit(params: ICellRendererParams & { showEdit: boolean; showDelete: boolean }) {
    this.params = params;
    this.comp = this.params.context.comp;
  }

  editItem() {
    const id = this.params.data.id;
    this.router.navigate([`${appRoutes.items.base}/${appRoutes.items.edit}/${id}`]);
  }

  getMoreDetails() {
    const id = this.params.data.id;
    this.router.navigate([`${appRoutes.items.base}/${appRoutes.items.viewStock}/${id}`]);
  }
  addItemPrices() {
    const id = this.params.data.id;
    this.router.navigate([`${appRoutes.items.base}/${appRoutes.items.addItemPrices}/${id}`]);
  }

  deleteCategory(id: string) {
    this.messagesService
      .templateComfirmation('هل متأكد من حذف هذا الصنف ؟', '', 'موافق', 'الغاء', 'error')
      .then((result) => {
        if (result.isConfirmed) {
          this.itemsService.deleteItem(this.params.data.id).subscribe((res) => {
            this.comp.dataSource = {
              getRows: (params: IGetRowsParams) => {
                this.comp.gridApi.showLoadingOverlay();
                this.comp.fetchDataAndLoadItems(params);
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
