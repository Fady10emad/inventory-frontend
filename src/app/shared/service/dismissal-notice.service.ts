import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { IBasePagesResponse } from '../models/response/IBasePagesResponse';
import { apiRoutes } from '../routers/apiRoutes';
import { IBaseResponse } from '../models/response/IBaseResponse';
import {
  IAddDismissalNoticePayload,
  IDismissalNoticeResponse,
  IDismissalNoticeUpdate,
  ITransaction,
} from '@app/modules/items/models/IAddDismissalNotice';

@Injectable({
  providedIn: 'root',
})
export class DismissalNoticeService {
  private readonly baseURL = environment.serverUrl;
  constructor(private http: HttpClient) {}

  getAllDismissalNotices(filters: any, searchObj?: any) {
    let params = new HttpParams();
    params = params.append('PageSize', filters.pageSize);
    params = params.append('PageNumber', filters.pageNumber);

    return this.http.get<IBasePagesResponse<any[]>>(
      this.baseURL + apiRoutes.dissmissalNotice.getAllDismissalNotice,

      {
        observe: 'response',
        params: params,
      }
    );
  }
  getAllDisburseOrAddMovement(filters: any, searchObj?: any) {
    let params = new HttpParams();
    params = params.append('PageSize', filters.pageSize);
    params = params.append('PageNumber', filters.pageNumber);

    return this.http.get<IBasePagesResponse<any[]>>(
      this.baseURL + apiRoutes.Transaction.getAllTransactions,

      {
        observe: 'response',
        params: params,
      }
    );
  }
  getDismissalNoticesById(DismissalNoticeId: string) {
    return this.http.get<IBaseResponse<IDismissalNoticeResponse>>(
      `${this.baseURL}${apiRoutes.dissmissalNotice.getDismissalNoticeById}/${DismissalNoticeId}`
    );
  }
  addDismissalNotice(data: any) {
    const url = this.baseURL + apiRoutes.dissmissalNotice.addDismissalNotice;
    return this.http.post<IBaseResponse<any>>(url, data);
  }

  deleteDismissalNotices(id: string) {
    return this.http.delete<IBaseResponse<boolean>>(
      `${this.baseURL}${apiRoutes.dissmissalNotice.deleteDismissalNotice}/${id}`
    );
  }

  editDismissalNotices(updatedDismissal: IDismissalNoticeUpdate) {
    return this.http.post<IBaseResponse<any>>(
      `${this.baseURL}${apiRoutes.dissmissalNotice.editDismissalNotice}`,
      updatedDismissal
    );
  }

  editTranaction(updatedTransaction: ITransaction) {
    return this.http.post<IBaseResponse<any>>(
      `${this.baseURL}${apiRoutes.Transaction.editTransaction}`,
      updatedTransaction
    );
  }
  deleteTranaction(id: string) {
    return this.http.delete<IBaseResponse<boolean>>(
      `${this.baseURL}${apiRoutes.Transaction.deleteTransaction}/${id}`
    );
  }
  addNewTranaction(Transaction: ITransaction) {
    return this.http.post<IBaseResponse<boolean>>(
      `${this.baseURL}${apiRoutes.Transaction.addTransaction}`,
      Transaction
    );
  }

  getTransactionById(id: string) {
    return this.http.get<IBaseResponse<ITransaction>>(
      `${this.baseURL}${apiRoutes.Transaction.getTransactionById}/${id}`
    );
  }

}
