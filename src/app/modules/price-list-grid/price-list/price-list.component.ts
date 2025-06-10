import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { L10n } from '@syncfusion/ej2-base';
import arAELocalization from '@shared/Json/locale-grid.json';
import { IItem } from '@app/shared/models/IItem';
import { IBasePagesResponse } from '@app/shared/models/response/IBasePagesResponse';
import {
  ActionArgs,
  ActionEventArgs,
  DataStateChangeEventArgs,
  FilterSettingsModel,
  Grid,
  GridComponent,
  LoadingIndicatorModel,
  PageEventArgs,
  PageSettingsModel,
  RecordClickEventArgs,
  RowDataBoundEventArgs,
} from '@syncfusion/ej2-angular-grids';
import {
  DataManager,
  DataResult,
  ODataAdaptor,
  ODataV4Adaptor,
  Query,
  ReturnOption,
  UrlAdaptor,
  WebApiAdaptor,
} from '@syncfusion/ej2-data';
import { ItemsService } from '@app/shared/service/items.service';
import { SerialNoAdaptor } from './customAdapter';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '@app/shared/routers/appRouters';
import { environment } from '@env';
import { apiRoutes } from '@app/shared/routers/apiRoutes';
import { Action } from 'rxjs/internal/scheduler/Action';
import { pagingActions } from '@syncfusion/ej2-angular-treegrid';

L10n.load(arAELocalization);

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.scss'],
})
export class PriceListComponent {
  private readonly baseURL = environment.serverUrl;
  @ViewChild('grid') grid?: GridComponent;
  locale: any = 'ar-AE';
  dataManager!: DataManager;
  pageSettings!: PageSettingsModel;
  loadingIndicator: LoadingIndicatorModel = { indicatorType: 'Shimmer' };
  pageNumber: number = 1;
  pageSize: number = 25;
  addNewPriceList: string = `/${appRoutes.priceList.base}/${appRoutes.priceList.addPriceList}`;

  constructor(
    private itemsService: ItemsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.pageSettings = { pageSize: this.pageSize };
    // this.updateDataSource();
    this.fetchAndLoadPriceLists();
  }

  public dataStateChange(state: DataStateChangeEventArgs) {
    this.getAsyncData(state);
  }

  fetchAndLoadPriceLists() {
    this.itemsService.getAllPriceLists(this.pageNumber, this.pageSize).subscribe((res) => {
      (this.grid as GridComponent).dataSource = {
        result: res.responseData.items,
        count: res.responseData.count,
      };
    });
  }

  // updateDataSource() {
  //   new DataManager({
  //     url: `${this.baseURL}${apiRoutes.priceList.getAllPriceLists}`,
  //     adaptor: new ODataAdaptor(),
  //   })
  //     .executeQuery(
  //       new Query()
  //         .addParams('PageNumber', this.pageNumber.toString())
  //         .addParams('PageSize', this.pageSize.toString())
  //     )
  //     .then((e: any) => {
  //       const actualResult = e.result.responseData.items;
  //       const actualCount = e.result.responseData.count;
  //       (this.grid as GridComponent).dataSource = {
  //         result: actualResult,
  //         count: actualCount,
  //       };
  //     });
  // }

  getAsyncData(state: DataStateChangeEventArgs) {
    if (state.action?.requestType === 'paging') {
      console.log((state.action as PageEventArgs).currentPage);
      this.pageNumber = +((state.action as PageEventArgs).currentPage ?? 0);
      // this.updateDataSource();
      this.fetchAndLoadPriceLists();
    }
  }

  editItem(id: string) {
    this.router.navigate([`${appRoutes.items.base}/${appRoutes.items.edit}/${id}`]);
  }
  getMoreDetails(id: string) {
    this.router.navigate([
      `${appRoutes.priceList.base}/${appRoutes.priceList.priceListItems}/${id}`,
    ]);
  }
  addPrices(id: string) {
    this.router.navigate([`${appRoutes.items.base}/${appRoutes.items.addItemPrices}/${id}`]);
  }
  deleteItem(id: string) {
    alert('not implemented yet');
  }

  dataBound(args: RowDataBoundEventArgs) {
    // (this.grid as GridComponent).autoFitColumns();
    // (this.grid as GridComponent).width = ((this
    //   .grid as GridComponent).getContentTable() as any).offsetWidth;
  }

  // getDataManager(
  //   pageNumber: number,
  //   pageSize: number,
  //   itemName?: string,
  //   categoryName?: string,
  //   barCodes?: string[],
  //   categoryCodes?: string[]
  // ): DataManager {
  //   const queryParams: any = {
  //     ItemName: itemName,
  //     CategoryName: categoryName,
  //     BarCode: barCodes,
  //     CategoryCode: categoryCodes,
  //     PageNumber: pageNumber,
  //     PageSize: pageSize,
  //   };

  //   const queryString = Object.keys(queryParams)
  //     .filter((key) => queryParams[key] !== undefined && queryParams[key] !== null)
  //     .map((key) => `${key}=${encodeURIComponent(queryParams[key])}`)
  //     .join('&');

  //   const url = `https://shippingportal.de:2033/Item/GetAllItems?${queryString}`;

  //   const dataManager = new DataManager({
  //     url: url,
  //     adaptor: new SerialNoAdaptor(),
  //     crossDomain: true,
  //   });
  //   return dataManager;
  // }
}
