export interface IAddDismissalNoticePayload {
  fromStoreId: number;
  toStoreId: number;
  exchangeOrderNumber: string;
  additionRequestNumber: string;
  itemDismissalNoticeRequestDTOs: IItemDismissalNoticeRequestDTOs[];
}

export interface IDismissalNoticeUpdate {
  id: number;
  fromStoreId: number;
  toStoreId: number;
  exchangeOrderNumber: string;
  additionRequestNumber: string;
  itemDismissalNoticeRequestDTOs: IItemDismissalNoticeRequestDTOs[];
}

export interface IItemDismissalNoticeRequestDTOs {
  reservedQuantityPiece: number;
  reservedQuantityPackage: number;
  itemId: number;
}

export interface ITransaction {
  id?: number;
  code: string;
  transactionType: number;
  debitAccount: string;
  creditAccount: string;
  costCenter: string;
  isPosted: boolean;
  description: string;
}

export interface IDismissalNoticeResponse {
  fromStoreId: number;
  toStoreId: number;
  exchangeOrderNumber: string;
  additionRequestNumber: string;
  itemDismissalNoticeRequestDTOs: [
    {
      reservedQuantityPiece: number;
      reservedQuantityPackage: number;
      itemId: number;
      code: string;
    }
  ];
}
