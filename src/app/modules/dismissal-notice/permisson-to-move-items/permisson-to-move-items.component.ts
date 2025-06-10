import { Component, OnInit } from '@angular/core';
import { StoreService } from '@app/shared/service/store.service';
import { IStore } from '@app/modules/store/models/IStroe';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessagesService } from '@app/shared/service/messages.service';
import { IItemInStore } from '@app/modules/items/models/IItemInStore';
import {
  IAddDismissalNoticePayload,
  IDismissalNoticeResponse,
} from '@app/modules/items/models/IAddDismissalNotice';
import { appRoutes } from '@app/shared/routers/appRouters';
import { ActivatedRoute, Router } from '@angular/router';
import { IProvider } from '@app/shared/models/IProvider';
import { DismissalNoticeService } from '@app/shared/service/dismissal-notice.service';

interface IPermissionToMoveItemsForm {
  fromStoreId: number;
  toStoreId: number;
  exchangeOrderNumber: string;
  addOrderNumber: string;
  itemsToMove: IItemInStore[];
}

@Component({
  selector: 'app-permisson-to-move-items',
  templateUrl: './permisson-to-move-items.component.html',
  styleUrls: ['./permisson-to-move-items.component.scss'],
})
export class PermissonToMoveItemsComponent implements OnInit {
  stores: IStore[] = [];
  availableItems: IItemInStore[] = [];
  appRoutes = appRoutes;
  isEdit: boolean = false;
  dismissalNoticeId!: number;
  constructor(
    private storeService: StoreService,
    private dismissalNoticeService: DismissalNoticeService,
    private fb: FormBuilder,
    private messageService: MessagesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  permissionToMoveItemsForm = this.initPermissionToMoveItemsForm();

  ngOnInit() {
    this.storeService.getAllStores({ pageSize: 100000, pageNumber: 1 }).subscribe((res) => {
      this.stores = res.body?.responseData.items || [];
    });

    this.permissionToMoveItemsForm.controls.fromStoreId.valueChanges.subscribe((value) => {
      if (value) {
        this.getAvailableItemsByStoreId(value);
      }
    });
    this.isEditRoute();
    // this.permissionToMoveItemsForm.controls.itemsToMove.valueChanges.subscribe((value) => {
    //   console.log(value);
    // });
    // for (let i = 0; i < this.permissionToMoveItemsForm.controls.itemsToMove.length; i++) {
    //   const formGroup = this.permissionToMoveItemsForm.controls.itemsToMove.at(i);
    //   formGroup.controls.codeId.valueChanges.subscribe((value) => {
    //     const item = this.availableItems.find((item) => item.id === value);
    //     if (item) {
    //       formGroup.controls.barcodeId.setValue(value, { emitEvent: false });
    //       formGroup.controls.itemName.setValue(item.itemName);
    //     }
    //   });
    // }
  }

  initPermissionToMoveItemsForm() {
    return this.fb.group({
      fromStoreId: this.fb.control<number | null>(null, [Validators.required]),
      toStoreId: this.fb.control<number | null>(null, [Validators.required]),
      exchangeOrderNumber: this.fb.control<string | null>(null),
      additionRequestNumber: this.fb.control<string | null>(null),
      itemsToMove: this.fb.array([].map(this.itemRow)),
    });
  }

  isEditRoute(): void {
    const currentRoute = this.activatedRoute.snapshot.url.map((segment) => segment.path);

    this.isEdit = currentRoute.includes('edit') ? true : false;
    if (this.isEdit) {
      this.dismissalNoticeId = this.activatedRoute.snapshot.params['id'];
      this.getDismissalNoticeById(this.dismissalNoticeId);
    }
  }

  getDismissalNoticeById(id: any) {
    this.dismissalNoticeService.getDismissalNoticesById(id).subscribe((res) => {
      res.responseData.itemDismissalNoticeRequestDTOs.forEach((item) => {
        this.addItemRow();
      });
      this.patchFormValue(res.responseData);
    });
  }

  patchFormValue(dissmissalNotice: IDismissalNoticeResponse) {
    this.permissionToMoveItemsForm.patchValue({
      fromStoreId: dissmissalNotice.fromStoreId,
      toStoreId: dissmissalNotice.toStoreId,
      exchangeOrderNumber: dissmissalNotice.exchangeOrderNumber,
      additionRequestNumber: dissmissalNotice.additionRequestNumber,
      itemsToMove: dissmissalNotice.itemDismissalNoticeRequestDTOs.map((item) => {
        return {
          code: item.code,
          itemNameId: item.itemId,
          barCodeId: item.itemId,
          currentAvailableBalance: item.reservedQuantityPiece,
          currentAvailableBalancePackage: item.reservedQuantityPackage,
        };
      }),
    });
  }

  addItemRow() {
    this.permissionToMoveItemsForm.controls.itemsToMove.push(this.itemRow());

    this.permissionToMoveItemsForm.controls.itemsToMove.controls.forEach((formGroup) => {
      formGroup.controls.code.disable();
      formGroup.controls.barCodeId.valueChanges.subscribe((value) => {
        const item = this.availableItems.find((item) => item.id === value);
        if (item) {
          formGroup.controls.code.setValue(item.code);
          formGroup.controls.itemNameId.setValue(value, { emitEvent: false });
        }
      });
      formGroup.controls.itemNameId.valueChanges.subscribe((value) => {
        const item = this.availableItems.find((item) => item.id === value);
        if (item) {
          formGroup.controls.code.setValue(item.code);
          formGroup.controls.barCodeId.setValue(value, { emitEvent: false });
        }
      });
    });
  }

  itemRow() {
    return this.fb.group({
      code: this.fb.control<string | null>(null),
      itemNameId: this.fb.control<number | null>(null),
      barCodeId: this.fb.control<number | null>(null),
      currentAvailableBalance: this.fb.control<number | null>(null),
      currentAvailableBalancePackage: this.fb.control<number | null>(null),
    });
  }

  removeItemRow(i: number) {
    this.permissionToMoveItemsForm.controls.itemsToMove.removeAt(i);
  }

  getAvailableItemsByStoreId(id: number) {
    this.storeService.getAvailableItemsByStoreId(id).subscribe((res) => {
      this.availableItems = res.responseData.items || [];
    });
  }

  addDismissalNotice() {
    if (this.permissionToMoveItemsForm.invalid|| 
      !this.permissionToMoveItemsForm.controls.exchangeOrderNumber.value || 
      !this.permissionToMoveItemsForm.controls.additionRequestNumber.value) {
      this.messageService.toast('من فضلك اِملأْ الحقول المطلوبة', 'error');
      return;
    }

    const payload = this.buildPayload();
    this.dismissalNoticeService.addDismissalNotice(payload).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.messageService.toast('تم اضافة الاذن بنجاح', 'success');
          this.router.navigate([
            `${appRoutes.dismissalNotice.base}/${appRoutes.dismissalNotice.grid}`,
          ]);
        } else {
          this.messageService.toast(res.message, 'error');
        }
      },
      error: (err) => {
        this.messageService.toast(err.message, 'error');
      },
    });
  }

  buildPayload() {
    const payload: IAddDismissalNoticePayload = {
      fromStoreId: Number(this.permissionToMoveItemsForm.controls.fromStoreId.getRawValue()),
      toStoreId: Number(this.permissionToMoveItemsForm.controls.toStoreId.getRawValue()),
      exchangeOrderNumber: this.permissionToMoveItemsForm.controls.exchangeOrderNumber.getRawValue()!,
      additionRequestNumber: this.permissionToMoveItemsForm.controls.additionRequestNumber.getRawValue()!,
      itemDismissalNoticeRequestDTOs: this.permissionToMoveItemsForm.controls.itemsToMove
        .getRawValue()
        .map((item) => {
          return {
            reservedQuantityPiece: item.currentAvailableBalance!,
            reservedQuantityPackage: item.currentAvailableBalancePackage!,
            itemId: item.itemNameId!,
          };
        }),
    };
    return payload;
  }

  saveEdit() {
    if (this.permissionToMoveItemsForm.invalid|| 
      !this.permissionToMoveItemsForm.controls.exchangeOrderNumber.value || 
      !this.permissionToMoveItemsForm.controls.additionRequestNumber.value) {
      this.messageService.toast('من فضلك اِملأْ الحقول المطلوبة', 'error');
      return;
    }

    const payload = this.buildPayload();
    this.dismissalNoticeService
      .editDismissalNotices({ ...payload, id: +this.dismissalNoticeId })
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.messageService.toast('تم تعديل الاذن بنجاح', 'success');
            this.router.navigate([
              `${appRoutes.dismissalNotice.base}/${appRoutes.dismissalNotice.grid}`,
            ]);
          } else {
            this.messageService.toast(res.message, 'error');
          }
        },
        error: (err) => {
          this.messageService.toast(err.message, 'error');
        },
      });
  }
}
