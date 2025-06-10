export interface PriceListForm {
  priceListArray: PriceListItemForm[];
  categoryId: string;
  code: string;
  description: string;
  profitabilityRatio: number;
  pageSizeSelect: number;
  itemNameFilter: string;
}

export interface PriceListItemForm {
  id: string;
  priceListDescription: string;
  itemName: string;
  price: number;
}
