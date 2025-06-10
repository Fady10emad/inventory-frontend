import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBaseResponse } from '../models/response/IBaseResponse';
import { apiRoutes } from '../routers/apiRoutes';
import { environment } from '@env';
import { IBasePagesResponse } from '../models/response/IBasePagesResponse';
import { IPaginationFilter } from '../models/IPaginationFilter';
import { IItemInStore } from '@app/modules/items/models/IItemInStore';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private readonly baseURL = environment.serverUrl;
  constructor(private http: HttpClient) {}

  addStore(data: any) {
    return this.http.post<IBaseResponse<any>>(`${this.baseURL}${apiRoutes.store.addStore}`, data);
  }

  getAllStores(filters: any, searchObj?: any) {
    let params = new HttpParams();
    params = params.append('pageSize', filters.pageSize);
    params = params.append('PageNumber', filters.pageNumber);

    return this.http.get<IBasePagesResponse<any[]>>(this.baseURL + apiRoutes.store.getAllStores, {
      observe: 'response',
      params: params,
    });
  }

  getStoreById(id: string) {
    return this.http.get<IBaseResponse<any>>(
      `${this.baseURL}${apiRoutes.store.getStoreById}/${id}`
    );
  }

  getItemDetailsInAllStores(id: string) {
    let params = new HttpParams();
    params = params.append('ItemID', id);
    params = params.append('PageNumber', 1);
    params = params.append('PageSize', 100);
    return this.http.get<IBasePagesResponse<any[]>>(
      `${this.baseURL}${apiRoutes.store.getItemStoreByItemId}`,
      {
        params,
      }
    );
  }

  getItemsListForStoreTable(
    storeId: string,
    { pageNumber, pageSize }: IPaginationFilter,
    categoryId?: any
  ) {
    let params = new HttpParams();
    if (categoryId) {
      params = params.append('CategoryID', categoryId);
    }
    params = params.append('StoreID', storeId);
    params = params.append('PageNumber', pageNumber);
    params = params.append('PageSize', pageSize);
    return this.http.get<IBasePagesResponse<any[]>>(
      this.baseURL + apiRoutes.store.getItemPriceByStoreID,
      {
        params: params,
      }
    );
  }

  deleteStore(id: string) {
    const url = this.baseURL + apiRoutes.store.deleteStore + '/' + id;
    return this.http.delete<IBaseResponse<boolean>>(url);
  }

  editStroe(updatedStore: any) {
    const url = this.baseURL + apiRoutes.store.editStore;
    return this.http.put<IBaseResponse<any>>(url, updatedStore);
  }

  getAvailableItemsByStoreId(storeId: number) {
    const url = this.baseURL + apiRoutes.store.getAvailableItemsByStoreId;
    return this.http.get<IBasePagesResponse<IItemInStore[]>>(url, {
      params: new HttpParams()
        .set('PageNumber', '1')
        .set('PageSize', '100000')
        .set('StoreID', storeId),
    });
  }

  addStockOfItems(data: any) {
    return this.http.post<IBaseResponse<any>>(
      `${this.baseURL}${apiRoutes.store.addItemStockForStore}`,
      data
    );
  }
}
