export interface IProvider {
  id: number;
  code: string;
  name: string;
  descriptionAr: string;
  responsible: string;
  closeDealings: number;
  paymentMethod: number;
  providerDiscount: number;
  paymentPeriod: number;
  phone: string;
  email: string;
  address: string;
  areaId: number;
  currencyId: number;
  providerCategoryId: number;
  competentoffice: string;
  taxRegistrationNumber: string;
  taxFileNumber: string;
  purchaseTax: number;
  discountTaxItems: number;
  discountTaxServices: number;
  valueAddedTaxServices: number;
  valueAddedTaxItems: number;
}
