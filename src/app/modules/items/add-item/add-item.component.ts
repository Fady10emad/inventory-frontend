import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ICategory } from '@app/shared/models/ICategory';
import { CategoriesService } from '@app/shared/service/categories.service';
import { MessagesService } from '@app/shared/service/messages.service';
import { appRoutes } from '@app/shared/routers/appRouters';
import { ItemsService } from '@app/shared/service/items.service';
import { IItem } from '@app/shared/models/IItem';
import {
  DiscountEnum,
  TransactionCloseEnum,
  DiscountTypeEnum,
  CategoryTypeEnum,
  PurchaseTaxEnum,
  SaleTaxEnum,
} from '@app/shared/enums/Item';
@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent {
  constructor(
    private fb: FormBuilder,
    private messageServie: MessagesService,
    private itemsService: ItemsService,
    private categoriesService: CategoriesService,
    private router: Router
  ) {}

  createItemForm!: FormGroup;
  subsCategories!: ICategory[];
  categoryType = CategoryTypeEnum;
  discount = DiscountEnum;
  discountType = DiscountTypeEnum;
  purchaseTaxEnum = PurchaseTaxEnum;
  saleTaxEnum = SaleTaxEnum;
  transactionClose = TransactionCloseEnum;

  ngOnInit(): void {
    this.getAllCategories().subscribe((res) => {
      this.subsCategories = res.responseData.items;
    });
    this.initCreateItemForm();
    this.observeDiscountChange();
    this.observeDiscountTypeChange();
    this.observePurchaseTaxChange();
    this.observeSaleTaxChange();
  }

  getAllCategories() {
    return this.categoriesService.getAllCategories(10000, 1, [this.categoryType.SubMain]);
  }

  initCreateItemForm() {
    this.createItemForm = this.fb.group({
      categoryId: this.fb.control(null, [Validators.required]),
      code: this.fb.control(null, [Validators.required]),
      barCode: this.fb.control(null),
      descriptionAr: this.fb.control(null, [Validators.required]),
      descriptionEn: this.fb.control(null, [Validators.required]),
      shortDescription: this.fb.control(null),
      brandDescription: this.fb.control(null),
      originCountry: this.fb.control(null),
      measruingUnit: this.fb.control(null),
      packageCapacity: this.fb.control(null),
      unitWeight: this.fb.control(null),
      discount: this.fb.control(this.discount.No),
      discountType: this.fb.control({ value: this.discountType.noType, disabled: true }),
      transactionClose: this.fb.control(this.transactionClose.No),
      purchaseTax: this.fb.control(this.purchaseTaxEnum.No, []),
      purchaseVat: this.fb.control({ value: null, disabled: true }, []),
      valueAddedTaxPurchase: this.fb.control(null, []),
      saleTax: this.fb.control(this.saleTaxEnum.No, []),
      saleVat: this.fb.control({ value: null, disabled: true }, []),
      valueAddedTaxSales: this.fb.control(null, []),
      price: this.fb.control(0, []),
    });
  }

  observeDiscountTypeChange() {
    const discountControl = this.createItemForm.get('discount');
    const discountTypeControl = this.createItemForm.get('discountType');

    discountTypeControl?.valueChanges.subscribe((value) => {
      if (+discountControl?.value === this.discount.No && +discountTypeControl.value !== 0) {
        this.messageServie.toast('لايمكنك اختيار نوع خصم اذا كان الخصم بلا');
        discountTypeControl.patchValue(this.discountType.noType);
      }
    });
  }

  observeDiscountChange() {
    const discountControl = this.createItemForm.get('discount');
    const discountTypeControl = this.createItemForm.get('discountType');

    discountControl?.valueChanges.subscribe((value) => {
      if (+value === this.discount.Yes) {
        discountTypeControl?.enable();
        discountTypeControl?.addValidators([Validators.required, Validators.min(1)]);
      } else {
        discountTypeControl?.removeValidators([Validators.required, Validators.min(1)]);
        discountTypeControl?.patchValue(this.discountType.noType);
        discountTypeControl?.disable();
      }
      discountTypeControl?.updateValueAndValidity();
    });
  }

  observePurchaseTaxChange() {
    const purchaseTaxControl = this.createItemForm.get('purchaseTax');
    const purchaseVatControl = this.createItemForm.get('purchaseVat');
    purchaseTaxControl?.valueChanges.subscribe((value) => {
      if (+value === this.purchaseTaxEnum.Yes) {
        purchaseVatControl?.enable();
        purchaseVatControl?.addValidators([Validators.required]);
      } else {
        purchaseVatControl?.disable();
        purchaseVatControl?.removeValidators([Validators.required]);
        purchaseVatControl?.reset();
      }
      purchaseVatControl?.updateValueAndValidity();
    });
  }

  observeSaleTaxChange() {
    const saleTaxControl = this.createItemForm.get('saleTax');
    const saleVatControl = this.createItemForm.get('saleVat');
    saleTaxControl?.valueChanges.subscribe((value) => {
      if (+value === this.saleTaxEnum.Yes) {
        saleVatControl?.enable();
        saleVatControl?.addValidators([Validators.required]);
      } else {
        saleVatControl?.disable();
        saleVatControl?.removeValidators([Validators.required]);
        saleVatControl?.reset();
      }
      saleVatControl?.updateValueAndValidity();
    });
  }

  addNewItem() {
    const newItem: IItem = {
      ...this.createItemForm.getRawValue(),
      valueAddedTaxPurchase: this.createItemForm.value.valueAddedTaxPurchase ?? 0,
      valueAddedTaxSales: this.createItemForm.value.valueAddedTaxSales ?? 0,
      saleVat: this.createItemForm.value.saleVat ?? 0,
      purchaseVat: this.createItemForm.value.purchaseVat ?? 0,
    };

    if (!this.createItemForm.valid) {
      this.messageServie.toast('من فضلك اِملأْ الحقول المطلوبة', 'error');
      this.createItemForm.markAllAsTouched();
      return;
    }

    this.itemsService.addNewItem(newItem).subscribe((res) => {
      if (res.isSuccess) {
        this.messageServie.toast('تم انشاء صنف', 'success');
        this.router.navigate([`${appRoutes.items.base}/${appRoutes.items.grid}`]);
      } else {
        this.messageServie.toast(res.message, 'error');
      }
    });
  }

  acceptNumbersOnly(event:any,formControlName:string){
    let value = event.target.value.replace(/[^\d.]/g, '');
    const text: any = [];
    for (let char of value) {
      if (!isNaN(parseInt(char, 10)) || char === '.') {
        text.push(char);
      }
    }
    let finalValue = text.join('');
    this.createItemForm.get(formControlName)?.setValue(finalValue);
  }

  
}
