export interface IItem {
  code: string;
  barCode: string;
  descriptionAr: string;
  descriptionEn: string;
  shortDescription: string;
  brandDescription: string;
  originCountry: string;
  measruingUnit: string;
  packageCapacity: string;
  unitWeight: string;
  discount: number;
  discountType: number;
  transactionClose: number;
  categoryId: number;
  purchaseTax: number;
  purchaseVat: number;
  valueAddedTaxPurchase: number;
  saleTax: number;
  saleVat: number;
  valueAddedTaxSales: number;
}
