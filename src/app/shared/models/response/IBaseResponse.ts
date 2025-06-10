export interface IBaseResponse<T> {
  isSuccess: boolean;
  version: number;
  message?: any;
  responseData: T;
  errors: any[];
}
