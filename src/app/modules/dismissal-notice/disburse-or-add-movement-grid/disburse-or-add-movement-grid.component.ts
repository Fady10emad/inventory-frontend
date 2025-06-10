import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AG_GRID_LOCALE_AR } from '@app/core/constants/locale.ar';
import { vendorHeaders } from '@app/modules/vendors/vendor-grid/vendorHeader';
import { appRoutes } from '@app/shared/routers/appRouters';
import { DismissalNoticeService } from '@app/shared/service/dismissal-notice.service';
import { ProviderService } from '@app/shared/service/provider.service';
import { GridApi, GridOptions, IDatasource, IGetRowsParams, GridReadyEvent } from 'ag-grid-community';
import { transactionHeaders } from './transactionHeaders';

@Component({
  selector: 'app-disburse-or-add-movement-grid',
  templateUrl: './disburse-or-add-movement-grid.component.html',
  styleUrls: ['./disburse-or-add-movement-grid.component.scss']
})
export class DisburseOrAddMovementGridComponent implements OnInit {

  adddisburseOrAdd:string=`/${appRoutes.dismissalNotice.base}/${appRoutes.dismissalNotice.disburseOrAddBase}/${appRoutes.dismissalNotice.disburseOrAddCreate}`

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dismissalNoteService: DismissalNoticeService,
  ) {}

  public localeText: {
    [key: string]: string;
  } = AG_GRID_LOCALE_AR;
  gridApi: GridApi = <GridApi>{};

  uiState = {
    gridReady: false as boolean,
    submitted: false as boolean,
    isExportLoading: false as boolean,
    filters: {
      pageNumber: 1,
      pageSize: 25,
      orderBy: 'id',
      orderDir: 'asc',
    } as any,
    Test: {
      list: [] as any[],
      TotalData: {} as any,
      totalPages: 0,
    },
  };

  gridOpts: GridOptions = {
    pagination: true,
    rowModelType: 'infinite',
    editType: 'fullRow',
    animateRows: true,
    columnDefs: transactionHeaders,
    suppressExcelExport: true,
    paginationAutoPageSize: false,
    paginationPageSizeSelector: false,
    paginationPageSize: this.uiState.filters.pageSize,
    cacheBlockSize: this.uiState.filters.pageSize,
    context: { comp: this },
    rowSelection: 'single',
    defaultColDef: {
      // flex: 1,
      // minWidth: 200,
      sortable: false,
      resizable: false,
      suppressMovable: true,
    },
    onGridReady: (e) => this.onGridReady(e),
    onSortChanged: (e) => this.onSort(e),
    onPaginationChanged: (e) => this.onPageChange(e),
  };

  ngOnInit(): void {}

  // Grid Definitions
  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.gridApi.showLoadingOverlay();
      this.fetchDataAndLoadDisburseOrAddMovement(params);
    },
  };
  onSort(e: GridReadyEvent) {
    let colState = e.api.getColumnState();
    colState.forEach((el) => {
      if (el.sort) {
        this.uiState.filters.orderBy = el.colId!;
        this.uiState.filters.orderDir = el.sort!;
      }
    });
  }

  onPageSizeChange() {
    this.gridApi.setGridOption('paginationPageSize', +this.uiState.filters.pageSize);
    this.gridOpts.cacheBlockSize = +this.uiState.filters.pageSize;
    this.gridApi.showLoadingOverlay();
    this.gridApi.setGridOption('datasource', this.dataSource);
  }

  onPageChange(params: GridReadyEvent) {
    if (this.uiState.gridReady) {
      this.uiState.filters.pageNumber = this.gridApi.paginationGetCurrentPage() + 1;
    }
  }

  onGridReady(param: GridReadyEvent) {
    this.gridApi = param.api;
    this.gridApi.setGridOption('datasource', this.dataSource);
    this.gridApi.sizeColumnsToFit();
  }

  fetchDataAndLoadDisburseOrAddMovement(params: IGetRowsParams, searchObj?: any) {
    const filtersObj = { ...this.uiState.filters };
    let sub = this.dismissalNoteService.getAllDisburseOrAddMovement(filtersObj).subscribe((res) => {
      if (res.body?.isSuccess) {
        this.uiState.Test.totalPages = res.body.responseData.count;
        this.uiState.Test.list = res.body.responseData.items;
        params.successCallback(this.uiState.Test.list, this.uiState.Test.totalPages);
        this.uiState.gridReady = true;
      }
      this.gridApi.hideOverlay();
    });
  }

  updateDataSource(searchObj?: any) {
    this.dataSource = {
      getRows: (params: IGetRowsParams) => {
        this.gridApi.showLoadingOverlay();
        this.fetchDataAndLoadDisburseOrAddMovement(params, searchObj);
      },
    };
    this.gridApi.setGridOption('datasource', this.dataSource);
  }

  ngOnDestroy(): void {}
}

