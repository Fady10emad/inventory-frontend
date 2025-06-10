import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { IBasePagesResponse } from '../models/response/IBasePagesResponse';
import { IBaseResponse } from '../models/response/IBaseResponse';
import { apiRoutes } from '../routers/apiRoutes';
import { IProvider } from '../models/IProvider';
import { IAddLookup } from '../models/ILookup';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private readonly baseURL = environment.serverUrl;
  constructor(private http: HttpClient) { }

  onAddArea= new Subject<boolean>();
  onAddCategory= new Subject<boolean>();
  onAddCurrrency= new Subject<boolean>();

  addNewProvider(provider: IProvider) {
    return this.http.post<IBaseResponse<boolean>>(
      `${this.baseURL}${apiRoutes.provid.addNewProvider}`,
      provider
    );
  }

  getAllProviders(Filters: any, searchObj?: any) {
    let params = new HttpParams();
    params = params.append('pageSize', Filters.pageSize);
    params = params.append('PageNumber', Filters.pageNumber);

    return this.http.get<IBasePagesResponse<any[]>>(this.baseURL + apiRoutes.provid.getALLProvider, {
      observe: 'response',
      params: params,
    });
  }
  
    getProviderById(id: any) {
      return this.http.get<IBaseResponse<IProvider>>(
        `${this.baseURL}${apiRoutes.provid.getProviderByID}/${id}`
      );
    }

  getProviderArea() {
    return this.http.get<IBaseResponse<any[]>>(this.baseURL + apiRoutes.lookup.Area, {
      observe: 'response'
    });
  }

  getProviderCurrency() {
    return this.http.get<IBaseResponse<any[]>>(this.baseURL + apiRoutes.lookup.Currency, {
      observe: 'response'
    });
  }

  getProviderProviderCategory() {
    return this.http.get<IBaseResponse<any[]>>(this.baseURL + apiRoutes.lookup.ProviderCategory, {
      observe: 'response'
    });
  }

  addProviderArea(area:IAddLookup)  {
    return this.http.post<IBaseResponse<boolean>>(
      `${this.baseURL}${apiRoutes.lookup.addArea}`,
      area
    );
  }

  addProviderCurrency(currency:IAddLookup)  {
    return this.http.post<IBaseResponse<boolean>>(
      `${this.baseURL}${apiRoutes.lookup.addCurrency}`,
      currency
    );
  }
  addProviderCategory(category:IAddLookup)  {
    return this.http.post<IBaseResponse<boolean>>(
      `${this.baseURL}${apiRoutes.lookup.addProviderCategory}`,
      category
    );
  }
  editProvider(updatedProvider: IProvider) {
    return this.http.put<IBaseResponse<any>>(
      `${this.baseURL}${apiRoutes.provid.editProvider}`,
      updatedProvider
    );
  }
  deleteProvider(id: string) {
    return this.http.delete<IBaseResponse<boolean>>(
      `${this.baseURL}${apiRoutes.provid.deleteProvider}/${id}`
    );
  }
}
