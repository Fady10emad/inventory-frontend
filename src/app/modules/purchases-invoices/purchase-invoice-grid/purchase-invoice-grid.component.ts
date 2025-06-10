import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AG_GRID_LOCALE_AR } from '@app/core/constants/locale.ar';
import { appRoutes } from '@app/shared/routers/appRouters';
import { DismissalNoticeService } from '@app/shared/service/dismissal-notice.service';
import { PurchaseInvoiceService } from '@app/shared/service/purchase-invoice.service';
import { GridApi, GridOptions, IDatasource, IGetRowsParams, GridReadyEvent } from 'ag-grid-community';
import { purchaseInvoiceHeaders } from './purchase-Invoices-Header';

@Component({
  selector: 'app-purchase-invoice-grid',
  templateUrl: './purchase-invoice-grid.component.html',
  styleUrls: ['./purchase-invoice-grid.component.scss']
})
export class PurchaseInvoiceGridComponent implements OnInit {
  addPurchaseInvoice = `${appRoutes.purchasesInvoice.base}/${appRoutes.purchasesInvoice.create}`
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private purchaseInvoiceService: PurchaseInvoiceService,
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
    columnDefs: purchaseInvoiceHeaders,
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
      this.fetchDataAndLoadPurchaseInvoice(params);
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

  fetchDataAndLoadPurchaseInvoice(params: IGetRowsParams, searchObj?: any) {
    const filtersObj = { ...this.uiState.filters };
    let sub = this.purchaseInvoiceService.getAllPurchaseInvoice(filtersObj).subscribe((res) => {
      if (res.body?.isSuccess) {
        this.uiState.Test.totalPages = res.body.responseData.count;
        this.uiState.Test.list = res.body.responseData.items;
        params.successCallback(this.uiState.Test.list, this.uiState.Test.totalPages);
        this.uiState.gridReady = true;
      }
      console.log(res)
      this.gridApi.hideOverlay();
    });
  }

  updateDataSource(searchObj?: any) {
    this.dataSource = {
      getRows: (params: IGetRowsParams) => {
        this.gridApi.showLoadingOverlay();
        this.fetchDataAndLoadPurchaseInvoice(params, searchObj);
      },
    };
    this.gridApi.setGridOption('datasource', this.dataSource);
  }

  ngOnDestroy(): void {}
}

