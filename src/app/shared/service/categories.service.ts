import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env';
import { apiRoutes } from '@shared/routers/apiRoutes';
import { ICategory } from '../models/ICategory';
import { IBasePagesResponse } from '../models/response/IBasePagesResponse';
import { IBaseResponse } from '../models/response/IBaseResponse';
import { CategoryTypeEnum } from '../enums/Item';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly baseURL = environment.serverUrl;
  constructor(private http: HttpClient) {}

  addNewCategory(category: ICategory) {
    return this.http.post<IBaseResponse<boolean>>(
      `${this.baseURL}${apiRoutes.categories.addNewCategory}`,
      category
    );
  }

  getAllCategories(pageSize: number, pageNumber: number, categoryTypeId: CategoryTypeEnum[]) {
    let params = new HttpParams();
    params = params.append('PageSize', pageSize);
    params = params.append('PageNumber', pageNumber);
    categoryTypeId.forEach((categoryType) => {
      params = params.append('CategoryType', categoryType);
    });
    return this.http.get<IBasePagesResponse<ICategory[]>>(
      `${this.baseURL}${apiRoutes.categories.getAllCategory}`,
      { params }
    );
  }

  getCategoryById(id: string) {
    return this.http.get<IBaseResponse<ICategory>>(
      `${this.baseURL}${apiRoutes.categories.getCategoryById}/${id}`
    );
  }

  editCategory(updatedCategory: ICategory) {
    return this.http.put<IBaseResponse<any>>(
      `${this.baseURL}${apiRoutes.categories.editCategory}`,
      updatedCategory
    );
  }

  deleteCategory(id: string) {
    return this.http.delete<IBaseResponse<boolean>>(
      `${this.baseURL}${apiRoutes.categories.deleteCategory}/${id}`
    );
  }
}
