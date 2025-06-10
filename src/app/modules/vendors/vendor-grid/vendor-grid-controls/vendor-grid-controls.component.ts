import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appRoutes } from '@app/shared/routers/appRouters';
import { ItemsService } from '@app/shared/service/items.service';
import { MessagesService } from '@app/shared/service/messages.service';
import { ICellRendererParams, IGetRowsParams } from 'ag-grid-community';
import { VendorGridComponent } from '../vendor-grid.component';
import { ProviderService } from '@app/shared/service/provider.service';

@Component({
  selector: 'app-vendor-grid-controls',
  templateUrl: './vendor-grid-controls.component.html',
  styleUrls: ['./vendor-grid-controls.component.scss'],
})
export class VendorGridControlsComponent implements OnInit {
  public params!: ICellRendererParams & { showEdit: boolean; showDelete: boolean };
  private comp!: VendorGridComponent;

  constructor(
    private messagesService: MessagesService,
    private router: Router,
    private providerService: ProviderService
  ) {}

  ngOnInit(): void {}

  agInit(params: ICellRendererParams & { showEdit: boolean; showDelete: boolean }) {
    this.params = params;
    this.comp = this.params.context.comp;
  }

  editProvider() {
    const id = this.params.data.id;
    this.router.navigate([`${appRoutes.vendor.base}/${appRoutes.vendor.edit}/${id}`]);
  }

  deleteProvider(id: string) {
    this.messagesService
      .templateComfirmation('هل متأكد من حذف هذا المورد؟', '', 'موافق', 'الغاء', 'error')
      .then((result) => {
        if (result.isConfirmed) {
          this.providerService.deleteProvider(this.params.data.id).subscribe((res) => {
            this.comp.dataSource = {
              getRows: (params: IGetRowsParams) => {
                this.comp.gridApi.showLoadingOverlay();
                this.comp.fetchDataAndLoadProvider(params);
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
