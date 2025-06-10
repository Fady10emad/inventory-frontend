export interface IPriceList {
  id: number;
  code: string;
  description: string;
  profitabilityRatio: number;
  itemPrices: number;
  isDeleted: boolean;
  createdBy: string;
  createdOn: string;
  modifyBy: null;
  modifyOn: string;
}

export interface IPriceListForItem {
  id: number;
  priceListDescription: string;
  itemName: string;
  price: number;
}

export interface AddPriceListRequest {
  code: string;
  description: string;
  profitabilityRatio: number;
}
