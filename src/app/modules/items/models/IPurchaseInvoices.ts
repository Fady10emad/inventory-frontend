export interface IPurchaseInvoicePayload {
  id?: number;
  documentNo: number;
  providerInvoiceNo: number;
  supplyOrderNo: number;
  notes: string;
  paymentMethod: number;
  invoiceDate: string;
  providesId: number;
  total_Value_Items: number;
  total_Value_Services: number;
  saleTax: number;
  purchaseTax: number;
  netInvoice: number;
  purchasesInvoiceItems: IPurchasesInvoiceItems[];
  purchasesInvoiceServices: IPurchasesInvoiceServices[];
  transactionPermissions?: any[];
}

export interface IPurchasesInvoiceItems {
  requiredQuantity: number;
  quantityAvailable: number;
  price: number;
  discount: number;
  value: number;
  storeId: number;
  itemId: number;
}
export interface IPurchasesInvoiceServices {
  bankCode: string;
  description: string;
  amount: number;
  price: number;
  discount: number;
  value: number;
}