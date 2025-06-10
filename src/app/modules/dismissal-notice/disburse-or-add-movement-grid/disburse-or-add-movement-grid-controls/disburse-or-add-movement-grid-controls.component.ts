import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { appRoutes } from '@app/shared/routers/appRouters';
import { DismissalNoticeService } from '@app/shared/service/dismissal-notice.service';
import { MessagesService } from '@app/shared/service/messages.service';
import { ICellRendererParams, IGetRowsParams } from 'ag-grid-community';
import { DisburseOrAddMovementGridComponent } from '../disburse-or-add-movement-grid.component';

@Component({
  selector: 'app-disburse-or-add-movement-grid-controls',
  templateUrl: './disburse-or-add-movement-grid-controls.component.html',
  styleUrls: ['./disburse-or-add-movement-grid-controls.component.scss'],
})
export class DisburseOrAddMovementGridControlsComponent {
  public params!: ICellRendererParams & { showEdit: boolean; showDelete: boolean };
  private comp!: DisburseOrAddMovementGridComponent;

  constructor(
    private messagesService: MessagesService,
    private router: Router,
    private dismissalNoteService: DismissalNoticeService
  ) {}

  ngOnInit(): void {}

  agInit(params: ICellRendererParams & { showEdit: boolean; showDelete: boolean }) {
    this.params = params;
    this.comp = this.params.context.comp;
  }

  editTransaction() {
    const id = this.params.data.id;
    this.router.navigate([
      `${appRoutes.dismissalNotice.base}/${appRoutes.dismissalNotice.disburseOrAddBase}/${appRoutes.dismissalNotice.disburseOrAddEdit}/${id}`,
    ]);
  }
  deleteTransaction(id: string) {
    this.messagesService
      .templateComfirmation('هل متأكد من حذف هذه الحركة؟', '', 'موافق', 'الغاء', 'error')
      .then((result) => {
        if (result.isConfirmed) {
          this.dismissalNoteService.deleteTranaction(this.params.data.id).subscribe((res) => {
            this.comp.dataSource = {
              getRows: (params: IGetRowsParams) => {
                this.comp.gridApi.showLoadingOverlay();
                this.comp.fetchDataAndLoadDisburseOrAddMovement(params);
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
