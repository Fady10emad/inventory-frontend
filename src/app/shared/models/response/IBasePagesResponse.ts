export interface IBasePagesResponse<T> {
  isSuccess: boolean;
  version: number;
  message?: any;
  responseData: IResponseData<T>;
  errors: any[];
}

interface IResponseData<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  items: T;
}
