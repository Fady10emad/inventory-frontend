export interface ILookup {
  id: number;
  nameEn: string;
  nameAr: string;
  internalCode: string;
  internalRef: number;
  description: string;
}

export interface IAddLookup {
  nameAr: string,
  nameEn: string,
  internalCode: string
}
