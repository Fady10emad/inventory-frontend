import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { L10n } from '@syncfusion/ej2-base';
import arAELocalization from '@shared/Json/locale-grid.json';
import {
  ColDef,
  GridReadyEvent,
  ICellRendererParams,
  IDatasource,
  IGetRowsParams,
  GridApi,
  RowModelType,
  GridOptions,
} from 'ag-grid-community';
import { ItemsService } from '@app/shared/service/items.service';

import { appRoutes } from '@app/shared/routers/appRouters';

import { AgGridAngular } from 'ag-grid-angular';
import { AG_GRID_LOCALE_AR } from '@app/core/constants/locale.ar';
import { ActivatedRoute, Router } from '@angular/router';

import { stockItemsRequsitionGridHeaders } from './stockRequsisitionGridHeaders';
import { StockRequsitionService } from '@app/shared/service/stock-requsition.service';
import { MovementEnum } from '@app/shared/enums/Item';

@Component({
  selector: 'app-stock-items-requsition-grid',
  templateUrl: './stock-items-requsition-grid.component.html',
  styleUrls: ['./stock-items-requsition-grid.component.scss'],
})
export class StockItemsRequsitionGridComponent {
  constructor(
    private stockRequsitionService: StockRequsitionService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  isAddRequest: boolean = false;
  AddOrIssue = MovementEnum.add;
  appRoutes = appRoutes;

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
    columnDefs: stockItemsRequsitionGridHeaders,
    suppressExcelExport: true,
    paginationAutoPageSize: false,
    paginationPageSizeSelector: false,
    paginationPageSize: this.uiState.filters.pageSize,
    cacheBlockSize: this.uiState.filters.pageSize,
    context: { comp: this },
    rowSelection: 'single',
    defaultColDef: {
      sortable: false,
      resizable: false,
      suppressMovable: true,
    },
    onGridReady: (e) => this.onGridReady(e),
    onSortChanged: (e) => this.onSort(e),
    onPaginationChanged: (e) => this.onPageChange(e),
  };

  ngOnInit() {
    let AddOrIssue = MovementEnum.add;
    this.activatedRoute.data.subscribe((data) => {
      this.isAddRequest =
        data['addOrIssue'] === appRoutes.stockItemsRequisition.addItemsRequestGrid;
      this.AddOrIssue = this.isAddRequest ? MovementEnum.add : MovementEnum.disburse;
    });
  }

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
    const filtersObj = { ...this.uiState.filters, transcationType: this.AddOrIssue };
    let sub = this.stockRequsitionService
      .getAllTransactionsPermission(filtersObj)
      .subscribe((res) => {
        if (res.body?.isSuccess) {
          console.log(res)
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
