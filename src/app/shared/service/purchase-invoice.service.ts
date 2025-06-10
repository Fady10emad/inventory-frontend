import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { IBaseResponse } from '../models/response/IBaseResponse';
import { apiRoutes } from '../routers/apiRoutes';
import { IDismissalNoticeResponse } from '@app/modules/items/models/IAddDismissalNotice';
import { IBasePagesResponse } from '../models/response/IBasePagesResponse';
import { IPurchaseInvoicePayload } from '@app/modules/items/models/IPurchaseInvoices';

@Injectable({
  providedIn: 'root'
})
export class PurchaseInvoiceService {

  private readonly baseURL = environment.serverUrl;
  constructor(private http: HttpClient) { }

  getAllPurchaseInvoice(filters: any, searchObj?: any) {
    let params = new HttpParams();
    params = params.append('PageSize', filters.pageSize);
    params = params.append('PageNumber', filters.pageNumber);

    return this.http.get<IBasePagesResponse<any[]>>(
      this.baseURL + apiRoutes.PurchaseInvoices.getPurchasesInvoice,

      {
        observe: 'response',
        params: params,
      }
    );
  }
  getPurchaseInvoiceById(PurchaseInvoiceId: number) {
    return this.http.get<IBaseResponse<IPurchaseInvoicePayload>>(
      `${this.baseURL}${apiRoutes.PurchaseInvoices.getPurchasesInvoiceById}/${PurchaseInvoiceId}`
    );
  }
  addPurchaseInvoice(data: any) {
    const url = this.baseURL + apiRoutes.PurchaseInvoices.addPurchasesInvoice;
    return this.http.post<IBaseResponse<any>>(url, data);
  }

  deletePurchaseInvoice(id: string) {
    return this.http.delete<IBaseResponse<boolean>>(
      `${this.baseURL}${apiRoutes.PurchaseInvoices.deletePurchasesInvoice}/${id}`
    );
  }

  editPurchaseInvoice(updatedPurchaseInvoice: IPurchaseInvoicePayload) {
    return this.http.post<IBaseResponse<any>>(
      `${this.baseURL}${apiRoutes.PurchaseInvoices.editPurchasesInvoice}`,
      updatedPurchaseInvoice
    );
  }
}
