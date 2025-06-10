import { dismissalNoticeHeaders } from './../dismissalNoticeHeaders';
import { Component } from '@angular/core';
import { ICellRendererParams, IGetRowsParams } from 'ag-grid-community';

import { Router } from '@angular/router';
import { MessagesService } from '@app/shared/service/messages.service';
import { appRoutes } from '@app/shared/routers/appRouters';
import { DismissalNoticeGridComponent } from '../dismissal-notice-grid.component';
import { DismissalNoticeService } from '@app/shared/service/dismissal-notice.service';

@Component({
  selector: 'app-dismissal-notice-grid-control',
  templateUrl: './dismissal-notice-grid-control.component.html',
  styleUrls: ['./dismissal-notice-grid-control.component.scss'],
})
export class DismissalNoticeGridControlComponent {
  public params!: ICellRendererParams & { showEdit: boolean; showDelete: boolean };
  private comp!: DismissalNoticeGridComponent;

  constructor(
    private messagesService: MessagesService,
    private router: Router,
    private dismissalNoticeServices: DismissalNoticeService
  ) {}

  ngOnInit(): void {}

  agInit(params: ICellRendererParams & { showEdit: boolean; showDelete: boolean }) {
    this.params = params;
    this.comp = this.params.context.comp;
  }

  editDismissalNotice() {
    const id = this.params.data.id;
    this.router.navigate([
      `${appRoutes.dismissalNotice.base}/${appRoutes.dismissalNotice.edit}/${id}`,
    ]);
  }

  deleteDismissalNotice(id: string) {
    this.messagesService
      .templateComfirmation('هل متأكد من حذف هذا الاذن؟', '', 'موافق', 'الغاء', 'error')
      .then((result) => {
        if (result.isConfirmed) {
          this.dismissalNoticeServices
            .deleteDismissalNotices(this.params.data.id)
            .subscribe((res) => {
              this.comp.dataSource = {
                getRows: (params: IGetRowsParams) => {
                  this.comp.gridApi.showLoadingOverlay();
                  this.comp.fetchDataAndLoadDismissalNotices(params);
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
