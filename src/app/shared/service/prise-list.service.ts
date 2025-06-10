import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { IBasePagesResponse } from '../models/response/IBasePagesResponse';
import { apiRoutes } from '../routers/apiRoutes';
import { IPriceList, IPriceListForItem } from '../models/IPriceList';
import { IBaseResponse } from '../models/response/IBaseResponse';

@Injectable({
  providedIn: 'root',
})
export class PriseListService {
  private readonly baseURL = environment.serverUrl;
  constructor(private http: HttpClient) {}

  getItemPriceForAllPriceLists(id: string) {
    return this.http.get<IBaseResponse<IPriceListForItem[]>>(
      `${this.baseURL}${apiRoutes.priceList.getAllPriceListsForItem}/${id}`
    );
  }

  getPriceListById(id: string) {
    let params = new HttpParams();
    params = params.append('PriceListID', id);
    return this.http.get<IBasePagesResponse<IPriceListForItem[]>>(
      `${this.baseURL}${apiRoutes.priceList.getAllPriceLists}`,
      {
        params,
      }
    );
  }

  addPriceList(piceListData: any) {
    return this.http.post<IBaseResponse<any>>(
      `${this.baseURL}${apiRoutes.priceList.addNewPriceList}`,
      piceListData
    );
  }

  updatePriceListDescription(data: { id: string, description: string }) {
    return this.http.put<any>(`${this.baseURL}/PriceList/UpdatePriceListDescription`, data);
  }
}
