import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessagesService } from '@app/shared/service/messages.service';
import { ProviderService } from '@app/shared/service/provider.service';
import { StoreService } from '@app/shared/service/store.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IItemForStores } from '../../models/IStroe';

@Component({
  selector: 'add-stock-of-items',
  templateUrl: './add-stock-of-items.component.html',
  styleUrls: ['./add-stock-of-items.component.scss'],
})
export class AddStockOfItemsComponent implements OnInit {
  @Input() storeId!: number;
  @Input() itemData!: IItemForStores;

  constructor(
    public fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private messagesService: MessagesService,
    private storeService: StoreService
  ) {}

  itemStockForm = this.fb.group({
    currentAvailableBalancePiece: this.fb.control<number | null>(null, [Validators.required]),
    currentAvailableBalancePackage: this.fb.control<number | null>(null, [Validators.required]),
    balanceFirstPeriodPiece: this.fb.control<number | null>(null),
    balanceFirstPeriodPackage: this.fb.control<number | null>(null),
  });

  ngOnInit(): void {
    this.itemStockForm.patchValue({
      currentAvailableBalancePiece: this.itemData?.currentAvailableBalancePiece,
      currentAvailableBalancePackage: this.itemData?.currentAvailableBalancePackage,
      balanceFirstPeriodPiece: this.itemData?.balanceFirstPeriodPiece,
      balanceFirstPeriodPackage: this.itemData?.balanceFirstPeriodPackage,
    });
  }

  submitForm() {
    if (!this.itemStockForm.valid) {
      this.messagesService.toast('من فضلك املأ الحقول المطلوبة', 'error');
      this.itemStockForm.markAllAsTouched();
      return;
    }

    const itemObjSent = [
      {
        itemId: Number(this.itemData.id),
        storeId: this.storeId,
        ...this.itemStockForm.value,
      },
    ];

    this.storeService.addStockOfItems(itemObjSent).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.messagesService.toast('تم تعديل الكمية', 'success');
          this.activeModal.close();
        } else {
          this.messagesService.toast('حدث خطأ', 'error');
        }
      },
      error: () => {
        this.messagesService.toast('حدث خطأ', 'error');
      },
    });
  }

  cancle() {
    this.activeModal.dismiss('Close click');
  }
}
