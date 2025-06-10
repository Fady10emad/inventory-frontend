import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { IItem } from '../models/IItem';
import { IBaseResponse } from '../models/response/IBaseResponse';
import { apiRoutes } from '../routers/apiRoutes';
import { IBasePagesResponse } from '../models/response/IBasePagesResponse';
import { Observable } from 'rxjs';
import { IPaginationFilter } from '../models/IPaginationFilter';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private readonly baseURL = environment.serverUrl;
  constructor(private http: HttpClient) {}

  addNewItem(item: IItem) {
    return this.http.post<IBaseResponse<boolean>>(
      `${this.baseURL}${apiRoutes.items.addNewItem}`,
      item
    );
  }

  getAllItems(Filters: any, searchObj?: any) {
    let params = new HttpParams();
    params = params.append('pageSize', Filters.pageSize);
    params = params.append('PageNumber', Filters.pageNumber);
    if (Filters.categoryNameSearch) {
      params = params.append('CategoryName', Filters.categoryNameSearch);
    }
    if (Filters.barcodeSearch) {
      params = params.append('BarCode', Filters.barcodeSearch);
    }
    if (Filters.itemNameSearch) {
      params = params.append('ItemName', Filters.itemNameSearch);
    }
    if (Filters.categoryCodeSearch) {
      params = params.append('CategoryCode', Filters.categoryCodeSearch);
    }
    return this.http.get<IBasePagesResponse<any[]>>(this.baseURL + apiRoutes.items.getAllItems, {
      observe: 'response',
      params: params,
    });
  }

  getItemById(id: any) {
    return this.http.get<IBaseResponse<IItem>>(
      `${this.baseURL}${apiRoutes.items.getItemById}/${id}`
    );
  }

  editItem(updatedItem: IItem) {
    return this.http.post<IBaseResponse<any>>(
      `${this.baseURL}${apiRoutes.items.editItem}`,
      updatedItem
    );
  }

  addItemPrices(data: any) {
    return this.http.post<IBaseResponse<any>>(
      `${this.baseURL}${apiRoutes.items.addItemPrices}`,
      data
    );
  }

  getItemCostById(id: string) {
    return this.http.get<IBaseResponse<any>>(
      `${this.baseURL}${apiRoutes.items.getItemCostById}/${id}`
    );
  }

  getItemsPriceForPriceList(Filters: any, priceListID: number, categoryId?: any) {
    let params = new HttpParams();
    params = params.append('pageSize', Filters.pageSize);
    params = params.append('PageNumber', Filters.pageNumber);
    if (categoryId) {
      params = params.append('CategoryID', categoryId);
    }
    params = params.append('PriceListID', priceListID);

    return this.http.get<IBasePagesResponse<any[]>>(
      this.baseURL + apiRoutes.items.getItemsPriceForPriceList,
      {
        observe: 'response',
        params: params,
      }
    );
  }

  getItemsPriceForPriceListTable(
    priceListId: string,
    { pageNumber, pageSize }: IPaginationFilter,
    categoryId?: any,
    itemName?: string
  ) {
    let params = new HttpParams();
    if (categoryId) {
      params = params.append('CategoryID', categoryId);
    }
    params = params.append('PriceListID', priceListId);
    params = params.append('PageNumber', pageNumber);
    params = params.append('PageSize', pageSize);
    if (itemName) {
      params = params.append('ItemName', itemName);
    }
    return this.http.get<IBasePagesResponse<any[]>>(
      this.baseURL + apiRoutes.items.getItemsPriceForPriceList,
      {
        params: params,
      }
    );
  }

  addItemListPrices(data: any) {
    return this.http.post<IBaseResponse<any>>(
      `${this.baseURL}${apiRoutes.priceList.addItemPrices}`,
      data
    );
  }

  getAllPriceLists(pageNumber: number, pageSize: number) {
    const params = {
      PageNumber: pageNumber.toString(),
      PageSize: pageSize.toString(),
    };
    return this.http.get<any>(`${this.baseURL}${apiRoutes.priceList.getAllPriceLists}`, {
      params,
    });
  }

  deleteItem(id: string) {
    return this.http.delete<IBaseResponse<boolean>>(
      `${this.baseURL}${apiRoutes.items.deleteItem}/${id}`
    );
  }

  searchItems(searchValue: string) {
    const searchText = encodeURIComponent(searchValue);
    return this.http.get<IBaseResponse<any[]>>(
      `${this.baseURL}${apiRoutes.items.searchItems}/${searchText}`
    );
  }
}
