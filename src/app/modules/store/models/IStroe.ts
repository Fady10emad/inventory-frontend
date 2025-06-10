export interface IItemForStores {
  id: number;
  itemName?: string;
  storeDescription: string;
  currentAvailableBalancePackage: number;
  currentAvailableBalancePiece: number;
  balanceFirstPeriodPiece: number;
  balanceFirstPeriodPackage: number;
  minimumPackage: number;
  minimumPiece: number;
  reservedQuantityPackage: number;
  reservedQuantityPiece: number;
}

export interface IStore {
  id: string;
  code: string;
  description: string;
  location: string;
  responsible: string;
  phone: string;
}
