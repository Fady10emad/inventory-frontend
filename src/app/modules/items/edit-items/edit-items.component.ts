  import { Component, OnInit } from '@angular/core';
  import { FormArray, FormBuilder, FormGroup, Validators ,AbstractControl } from '@angular/forms';
  import { ActivatedRoute, Router } from '@angular/router';
  import { ICategory } from '@app/shared/models/ICategory';
  import { CategoriesService } from '@app/shared/service/categories.service';
  import { MessagesService } from '@app/shared/service/messages.service';
  import {
    DiscountEnum,
    TransactionCloseEnum,
    DiscountTypeEnum,
    CategoryTypeEnum,
    PurchaseTaxEnum,
    SaleTaxEnum,
  } from '@app/shared/enums/Item';
  import { ItemsService } from '@app/shared/service/items.service';
  import { IItem } from '@app/shared/models/IItem';
  import {} from '@app/shared/enums/categoryTypeEnum';
  import { PriseListService } from '@app/shared/service/prise-list.service';
  import { IPriceListForItem } from '@app/shared/models/IPriceList';
  import { appRoutes } from '@app/shared/routers/appRouters';
  import { StoreService } from '@app/shared/service/store.service';
  import { IItemForStores } from '@app/modules/store/models/IStroe';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { AddStockOfItemsComponent } from '@app/modules/store/components/add-stock-of-items/add-stock-of-items.component';
  import { Subject } from 'rxjs';
  import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
  @Component({
    selector: 'app-edit-items',
    templateUrl: './edit-items.component.html',
    styleUrls: ['./edit-items.component.scss'],
  })
  export class EditItemsComponent {
    constructor(
      private fb: FormBuilder,
      private messageServie: MessagesService,
      private itemsService: ItemsService,
      private priceListService: PriseListService,
      private storeService: StoreService,
      private categoriesService: CategoriesService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private modalService: NgbModal,
 
    ) {}
    itemId!: string;
    subsCategories!: ICategory[];
    categoryType = CategoryTypeEnum;
    discount = DiscountEnum;
    discountType = DiscountTypeEnum;
    transactionClose = TransactionCloseEnum;
    purchaseTaxEnum = PurchaseTaxEnum;
    priceList!: IPriceListForItem[];
    storeListForItem!: IItemForStores[];
    saleTaxEnum = SaleTaxEnum;
    active = 1;
    editItemForm!: FormGroup;
    private stockUpdateSubject = new Subject<any>()
    ngOnInit(): void {
      this.itemId = this.activatedRoute.snapshot.params['itemId'];
      this.getAllSubCategories().subscribe((res) => {
        this.subsCategories = res.responseData.items;
      });
      this.initEditItemForm();
      this.observeDiscountChange();
      this.observePurchaseTaxChange();
      this.observeSaleTaxChange();
      this.observeDiscountTypeChange();
      this.getAllPriceListByItemId();
      this.getAllStoresWithItem();
      this.stockUpdateSubject.pipe(
        debounceTime(500), // wait 500ms after last change
        distinctUntilChanged() // only emit if value is different from previous
      ).subscribe(stockData => {
        this.updateStock(stockData);
      });
    }

    getAllSubCategories() {
      return this.categoriesService.getAllCategories(10000, 1, [this.categoryType.SubMain]);
    }
    initEditItemForm() {
      this.editItemForm = this.fb.group({
        categoryId: this.fb.control<number | null>(null, [Validators.required]),
        code: this.fb.control('', [Validators.required]),
        barCode: this.fb.control(''),
        descriptionAr: this.fb.control('', [Validators.required]),
        descriptionEn: this.fb.control('', [Validators.required]),
        shortDescription: this.fb.control(''),
        brandDescription: this.fb.control(''),
        originCountry: this.fb.control(''),
        measruingUnit: this.fb.control(''),
        packageCapacity: this.fb.control(''),
        unitWeight: this.fb.control(''),
        discount: this.fb.control(this.discount.No),
        discountType: this.fb.control(this.discountType.noType),
        transactionClose: this.fb.control(this.transactionClose.No),
        lastPurchasePrice: this.fb.control({ value: 0, disabled: true }),
        currentAverageCost: this.fb.control({ value: 0, disabled: true }),
        averageCostOftheBeginningterm: this.fb.control({ value: 0, disabled: true }),
        purchaseTax: this.fb.control(this.purchaseTaxEnum.No, []),
        purchaseVat: this.fb.control<number | null>(null, []),
        valueAddedTaxPurchase: this.fb.control<number | null>(null, []),
        saleTax: this.fb.control(this.saleTaxEnum.No, []),
        saleVat: this.fb.control<number | null>(null, []),
        valueAddedTaxSales: this.fb.control<number | null>(null, []),
        price: this.fb.control(0, []),

        priceListArray: this.fb.array([]),
        storesArray: this.fb.array([]),
      });
      this.getItemyById(this.itemId);
    }

    get priceListFormArray() {
      return this.editItemForm.get('priceListArray') as FormArray;
    }
    get storesFormArray() {
      return this.editItemForm.get('storesArray') as FormArray;
    }

    getItemyById(itemId: string) {
      this.itemsService.getItemById(itemId).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            const item = res.responseData;
            this.editItemForm.patchValue(item);
          }
        },
      });
    }

    observeDiscountTypeChange() {
      const discountControl = this.editItemForm.get('discount');
      const discountTypeControl = this.editItemForm.get('discountType');

      discountTypeControl?.valueChanges.subscribe((value) => {
        if (+discountControl?.value === this.discount.No && +discountTypeControl.value !== 0) {
          this.messageServie.toast('لايمكنك اختيار نوع خصم اذا كان الخصم بلا');
          discountTypeControl.patchValue(this.discountType.noType);
        }
      });
    }

    observeDiscountChange() {
      const discountControl = this.editItemForm.get('discount');
      const discountTypeControl = this.editItemForm.get('discountType');

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
      const purchaseTaxControl = this.editItemForm.get('purchaseTax');
      const purchaseVatControl = this.editItemForm.get('purchaseVat');
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
      const saleTaxControl = this.editItemForm.get('saleTax');
      const saleVatControl = this.editItemForm.get('saleVat');
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

    editItem() {
      const { priceListArray, ...valuesWithoutPrices } = this.editItemForm.value;
      const updatedItem: IItem = {
        id: this.itemId,
        ...valuesWithoutPrices,
      };

      if (!this.editItemForm.valid) {
        this.messageServie.toast('من فضلك اِملأْ الحقول المطلوبة', 'error');
        this.editItemForm.markAllAsTouched();
        return;
      }
      const changedPriceLists: any = [];
      this.priceListFormArray.controls.forEach((control) => {
        if (control.dirty) {
          changedPriceLists.push({
            itemId: this.itemId,
            pricelistId: control.value.id,
            itemPrice: control.value.price ?? 0,
          });
        }
      });

      this.itemsService.editItem(updatedItem).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.messageServie.toast('تم تعديل الصنف', 'success');
            this.router.navigate([`${appRoutes.items.base}/${appRoutes.items.grid}`]);
          } else {
            this.messageServie.toast('حدث خطأ ما', 'error');
          }
        },
      });

      this.itemsService.addItemPrices(changedPriceLists).subscribe({
        next: (res) => {
          // this.messageServie.toast('تم تعديل الصنف', 'success');
          // this.router.navigate([`${appRoutes.items.base}/${appRoutes.items.grid}`]);
        },
        error: (err) => {
          this.messageServie.toast('حدث خطأ ما', 'error');
        },
      });
    }

    getAllPriceListByItemId() {
      this.priceListService.getItemPriceForAllPriceLists(this.itemId).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.priceList = res.responseData;
            this.addPriceListFormGroupToFormArray();
          }
        },
      });
    }

    getAllStoresWithItem() {
      this.storeService.getItemDetailsInAllStores(this.itemId).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.storeListForItem = res.responseData.items;
            this.addAllStoresToFormArray();
          }
        },
      });
    }

    addPriceListFormGroupToFormArray() {
      this.priceList.forEach((item) => {
        this.priceListFormArray.push(
          this.fb.group({
            id: item.id,
            priceListDescription: item.priceListDescription,
            itemName: item.itemName,
            price: item.price,
          })
        );
      });
    }
    addAllStoresToFormArray() {
      this.storeListForItem.forEach((item) => {
        const newGroup = this.fb.group({
          id: item.id,
          storeDescription: item.storeDescription,
          currentAvailableBalancePiece: item.currentAvailableBalancePiece,
          currentAvailableBalancePackage: item.currentAvailableBalancePackage,
          balanceFirstPeriodPiece: item.balanceFirstPeriodPiece,
          balanceFirstPeriodPackage: item.balanceFirstPeriodPackage,
          minimumPiece: item.minimumPiece,
          minimumPackage: item.minimumPackage,
          reservedQuantityPiece: item.reservedQuantityPiece,
          reservedQuantityPackage: item.reservedQuantityPackage,
        });

    
        this.storesFormArray.push(newGroup);
      });

    }
    addItemsDataToStore(itemData: any, stroeId: string) {
      const modalRef = this.modalService.open(AddStockOfItemsComponent, {
        size: 'lg',
        centered: true,
      });

      modalRef.componentInstance.storeId = stroeId;
      modalRef.componentInstance.itemData = { ...itemData, id: this.itemId };
      modalRef.componentInstance.ItemData = modalRef.result.then((result) => {
        this.storesFormArray.clear();
        this.getAllStoresWithItem();
      });
    }

    updateStock(stockData: any) {
      if (!stockData) return;
      
      const formGroup = this.storesFormArray.controls.find(control => 
        control.value.id === stockData.id
      ) as FormGroup;
    
      if (!formGroup || !formGroup.dirty) {
        return;
      }
    
      // Create payload with proper number conversion
      const payload = {
        itemId: Number(this.itemId),
        storeId: stockData.id,
        minimumPiece: stockData.minimumPiece ? Number(stockData.minimumPiece) : 0,
        minimumPackage: stockData.minimumPackage ? Number(stockData.minimumPackage) : 0,
        reservedQuantityPiece: stockData.reservedQuantityPiece ? Number(stockData.reservedQuantityPiece) : 0,
        reservedQuantityPackage: stockData.reservedQuantityPackage ? Number(stockData.reservedQuantityPackage) : 0,
        currentAvailableBalancePiece: stockData.currentAvailableBalancePiece ? Number(stockData.currentAvailableBalancePiece) : 0,
        currentAvailableBalancePackage: stockData.currentAvailableBalancePackage ? Number(stockData.currentAvailableBalancePackage) : 0,
        balanceFirstPeriodPiece: stockData.balanceFirstPeriodPiece ? Number(stockData.balanceFirstPeriodPiece) : 0,
        balanceFirstPeriodPackage: stockData.balanceFirstPeriodPackage ? Number(stockData.balanceFirstPeriodPackage) : 0
      };
      
      this.storeService.addStockOfItems([payload]).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.messageServie.toast('تم تحديث الكميات بنجاح', 'success');
            formGroup.markAsPristine();
          } else {
            this.messageServie.toast('حدث خطأ أثناء التحديث', 'error');
          }
        },
        error: () => {
          this.messageServie.toast('حدث خطأ أثناء التحديث', 'error');
        }
      });
    }

    onStockInputBlur(control: AbstractControl) {
      const formGroup = control as FormGroup;
      // Force update the form value
      formGroup.updateValueAndValidity({ onlySelf: false, emitEvent: false });
      this.updateStock(formGroup.value);
    }
    onStockInputChange(control: AbstractControl, fieldName: string, event: Event) {
      const inputElement = event.target as HTMLInputElement;
      const newValue = inputElement.value;
      
      // Update the form control value immediately
      control.get(fieldName)?.setValue(newValue, { emitEvent: false });
      
      // Mark the form as dirty
      control.markAsDirty();
      
      // Trigger update with debounce
      this.stockUpdateSubject.next(control.value);
    }
  }
