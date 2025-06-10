import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { L10n } from '@syncfusion/ej2-base';
import arAELocalization from '@shared/Json/locale-grid.json';
import {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
  GridApi,
  GridOptions,
} from 'ag-grid-community';
import { ItemsService } from '@app/shared/service/items.service';

import { appRoutes } from '@app/shared/routers/appRouters';

import { AG_GRID_LOCALE_AR } from '@app/core/constants/locale.ar';
import { ActivatedRoute, Router } from '@angular/router';

import { storeHeaders } from './storeHeaders';
import { StoreService } from '@app/shared/service/store.service';
@Component({
  selector: 'app-store-grid',
  templateUrl: './store-grid.component.html',
  styleUrls: ['./store-grid.component.scss'],
})
export class StoreGridComponent {
  constructor(
    private storeService: StoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  public localeText: {
    [key: string]: string;
  } = AG_GRID_LOCALE_AR;
  gridApi: GridApi = <GridApi>{};
  appRoutes = appRoutes;

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
    columnDefs: storeHeaders,
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
      this.fetchDataAndLoadItems(params);
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

  fetchDataAndLoadItems(params: IGetRowsParams, searchObj?: any) {
    const filtersObj = { ...this.uiState.filters };
    let sub = this.storeService.getAllStores(filtersObj).subscribe((res) => {
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
        this.fetchDataAndLoadItems(params, searchObj);
      },
    };
    this.gridApi.setGridOption('datasource', this.dataSource);
  }

  ngOnDestroy(): void {}
}
