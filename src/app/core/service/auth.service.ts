import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiRoutes } from '@app/shared/routers/apiRoutes';
import { environment } from 'environments/environment.prod';
import { localStorageKeys } from '../enums/localStorageKeys';
import { IBaseResponse } from '@app/shared/models/response/IBaseResponse';
import { JwtToken, LoginCredentials, LoginResponse } from '@app/shared/models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.serverUrl;
  constructor(private http: HttpClient) {}

  login(data: LoginCredentials) {
    return this.http.post<IBaseResponse<LoginResponse>>(
      `${this.baseUrl}${apiRoutes.account.login}`,
      data
    );
  }

  logout() {
    localStorage.removeItem(localStorageKeys.JWT);
  }

  get currentToken() {
    return localStorage.getItem(localStorageKeys.JWT);
  }

  public isAuthenticated(): boolean {
    const token = this.currentToken;
    return token !== null && !this.isTokenExpired();
  }

  public isTokenExpired(): boolean {
    try {
      const decodedString = this.currentToken?.split('.')[1];
      const decoded = JSON.parse(atob(decodedString ?? '')) as JwtToken;
      const expirationTime = new Date(decoded.exp * 1000).getTime();
      const currentTime = Date.now();
      return expirationTime < currentTime;
    } catch (error) {
      return true;
    }
  }
}
