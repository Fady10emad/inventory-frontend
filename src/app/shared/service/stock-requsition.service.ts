import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { MovementEnum } from '../enums/Item';
import { apiRoutes } from '../routers/apiRoutes';
import { IBasePagesResponse } from '../models/response/IBasePagesResponse';
import { ITransaction } from '@app/modules/items/models/IAddDismissalNotice';
import { IBaseResponse } from '../models/response/IBaseResponse';

@Injectable({
  providedIn: 'root',
})
export class StockRequsitionService {
  private readonly baseURL = environment.serverUrl;
  constructor(private http: HttpClient) {}

  getTransactionsByType(type: MovementEnum) {
    return this.http.get<IBaseResponse<ITransaction[]>>(
      `${this.baseURL}${apiRoutes.stockItemsRequisition.getTransactionsByType}/${type}`
    );
  }

  addNewTransaction(stockItemsRequisition: any) {
    return this.http.post<any>(
      `${this.baseURL}${apiRoutes.stockItemsRequisition.addItemsRequest}`,
      stockItemsRequisition
    );
  }

  editTransactionPermission(stockItemsRequisition: any) {
    return this.http.post<any>(
      `${this.baseURL}${apiRoutes.stockItemsRequisition.editItemRequest}`,
      stockItemsRequisition
    );
  }

  getTransactionPermissionById(transactionID: number) {
    return this.http.get<any>(
      `${this.baseURL}${apiRoutes.stockItemsRequisition.getTransactionPermissionById}/${transactionID}`
    );
  }

  getAllTransactionsPermission(Filters: any, searchObj?: any) {
    let params = new HttpParams();
    params = params.append('pageSize', Filters.pageSize);
    params = params.append('PageNumber', Filters.pageNumber);
    params = params.append('TransactionType', Filters.transcationType);

    return this.http.get<IBasePagesResponse<any[]>>(
      this.baseURL + apiRoutes.stockItemsRequisition.getAllTransactionsPermission,
      {
        observe: 'response',
        params: params,
      }
    );
  }
}
