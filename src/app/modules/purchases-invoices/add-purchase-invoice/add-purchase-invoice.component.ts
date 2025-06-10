import { Component, OnInit } from '@angular/core';
import { FormGroup , FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IItemInStore } from '@app/modules/items/models/IItemInStore';
import { IPurchaseInvoicePayload } from '@app/modules/items/models/IPurchaseInvoices';
import { IStore } from '@app/modules/store/models/IStroe';
import { PaymentMethodEnum } from '@app/shared/enums/Item';
import { IProvider } from '@app/shared/models/IProvider';
import { appRoutes } from '@app/shared/routers/appRouters';
import { MessagesService } from '@app/shared/service/messages.service';
import { ProviderService } from '@app/shared/service/provider.service';
import { PurchaseInvoiceService } from '@app/shared/service/purchase-invoice.service';
import { StoreService } from '@app/shared/service/store.service';
import { Value } from '@syncfusion/ej2/querybuilder';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StockRequsitionService } from './../../../shared/service/stock-requsition.service';
import { ConfirmModalComponent } from './confirm-modal.component';
import { MovementEnum } from '@app/shared/enums/Item';
@Component({
  selector: 'app-add-purchase-invoice',
  templateUrl: './add-purchase-invoice.component.html',
  styleUrls: ['./add-purchase-invoice.component.scss'],
})
export class AddPurchaseInvoiceComponent implements OnInit {
  purchasesInvoiceForm = this.initPurchaseInvoiceForm();
  PaymentMethod = PaymentMethodEnum;
  stores: IStore[] = [];
  providers: IProvider[] = [];
  availableItems: IItemInStore[] = [];
  selectedItem!: any;
  isSelectedItme: boolean = false;
  isEdit: boolean = false;
  purchaseInvoiceId!: number;
  totalItemValue: any = 0;
  totalServiceValue: any = 0;
  appRoutes: any;
  currentInvoiceId: number | null = null;
  transactionPermissions: any[] = [];
  storeCache: {[key: string]: string} = {}; // Cache for store names
  loadingStores: Set<string> = new Set(); 
  storeDisplayCache: {[key: number]: string} = {};
  gridLink: string = `${appRoutes.purchasesInvoice.base}/${appRoutes.purchasesInvoice.grid}`;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private messageService: MessagesService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private storeService: StoreService,
    private providerService: ProviderService,
    private purchaseInvoiceService: PurchaseInvoiceService,
    private stockRequsitionService: StockRequsitionService
  ) {}

  ngOnInit(): void {
    this.purchaseInvoiceId = this.activatedRoute.snapshot.params['id'];

    this.storeService.getAllStores({ pageSize: 100000, pageNumber: 1 }).subscribe((res) => {
      this.stores = (res.body?.responseData.items || []).map(store => ({
        ...store,
        displayLabel: `${store.code} - ${store.description}` // Add this line
      }));
    });

    this.providerService.getAllProviders({ pageSize: 100000, pageNumber: 1 }).subscribe((res) => {
      this.providers = res.body?.responseData.items || [];
    });

    this.purchasesInvoiceForm.controls.purchasesInvoiceServices.controls.forEach((service) => {
      service.controls.price.valueChanges.subscribe((_) => {
        const discountPercentage = Number(service.controls.discount.value) / 100;
        service.controls.value.patchValue(
          discountPercentage * Number(service.controls.price.value)
        );
      });
      service.controls.discount.valueChanges.subscribe((_) => {
        const discountPercentage = Number(service.controls.discount.value) / 100;
        service.controls.value.patchValue(
          discountPercentage * Number(service.controls.price.value)
        );
      });
    });

    this.isEditRoute();
    this.listenToChangesinStoreValue();
  }

  listenToChangesinStoreValue() {
    for (let i = 0; i < this.purchasesInvoiceForm.controls.purchasesInvoiceItems.length; i++) {
      this.purchasesInvoiceForm.controls.purchasesInvoiceItems.controls[
        i
      ].controls.storeId.valueChanges.subscribe((value) => {
        if (value) {
          this.getAvailableItemsByStoreId(value);
          this.isEditRoute();
        }
      });
    }
  }

  initPurchaseInvoiceForm() {
    return this.fb.group({
      documentNo: this.fb.control<number | null>(null, [Validators.required]),
      providerInvoiceNo: this.fb.control<number | null>(null, [Validators.required]),
      supplyOrderNo: this.fb.control<number | null>(null, [Validators.required]),
      // store: this.fb.control<number | null>(null,[Validators.required]),
      notes: this.fb.control<string | null>(null, [Validators.required]),
      paymentMethod: this.fb.control<number | null>(null, [Validators.required]),
      invoiceDate: this.fb.control<string | null>(null, [Validators.required]),
      providesId: this.fb.control<number | null>(null, [Validators.required]),
      purchasesInvoiceItems: this.fb.array([].map(this.purchasesInvoiceItemRow)),
      purchasesInvoiceServices: this.fb.array([].map(this.purchasesInvoiceServicesRow)),
      // total_Value_Items: this.fb.control<number | null>(null,[Validators.required]),
      // total_Value_Services: this.fb.control<number | null>(null,[Validators.required]),
      // saleTax: this.fb.control<number | null>(null,[Validators.required]),
      // purchaseTax: this.fb.control<number | null>(null,[Validators.required]),
      // netInvoice: this.fb.control<number | null>(null,[Validators.required]),
    });
  }
  isEditRoute(): void {
    const currentRoute = this.activatedRoute.snapshot.url.map((segment) => segment.path);

    this.isEdit = currentRoute.includes('edit') ? true : false;
    if (this.isEdit) {
      this.getPurchaseInvoiceById(this.purchaseInvoiceId);
    }
  }
  
  purchasesInvoiceItemRow(item?: any) {
    const formGroup = this.fb.group({
      storeId: this.fb.control<any | null>(item ? item.storeId : null, Validators.required),
      itemId: this.fb.control<any | null>(item ? item.itemId : null),
      requiredQuantity: this.fb.control<number | null>(
        item ? item.requiredQuantity : null,
        Validators.required
      ),
      quantityAvailable: this.fb.control<number | null>(
        item ? item.quantityAvailable : null,
        Validators.required
      ),
      price: this.fb.control<number | null>(item ? item.price : null, Validators.required),
      discount: this.fb.control<number | null>(item ? item.discount : null, Validators.required),
      value: this.fb.control<number | null>(
        { value: item ? item.value : null, disabled: true },
        Validators.required
      ),
    });
  
    // Add value change listeners
    this.setupValueCalculation(formGroup);
  
    return formGroup;
  }

  private setupValueCalculation(formGroup: FormGroup): void {
    const calculateValue = () => {
      const price = formGroup.get('price')?.value ?? 0;
      const discount = formGroup.get('discount')?.value ?? 0;
      const quantity = formGroup.get('requiredQuantity')?.value ?? 0;
      
      // Calculate: (price - (price * discount/100)) * quantity
      const discountedPrice = price - (price * (discount / 100));
      const value = discountedPrice * quantity;
      
      formGroup.get('value')?.patchValue(Number(value.toFixed(2)), { emitEvent: false });
    };
  
    // Set up listeners
    formGroup.get('price')?.valueChanges.subscribe(calculateValue);
    formGroup.get('discount')?.valueChanges.subscribe(calculateValue);
    formGroup.get('requiredQuantity')?.valueChanges.subscribe(calculateValue);
  
    // Initial calculation if values exist
    if (formGroup.get('price')?.value !== null || 
        formGroup.get('discount')?.value !== null || 
        formGroup.get('requiredQuantity')?.value !== null) {
      calculateValue();
    }
  }

  purchasesInvoiceServicesRow(service?: any) {
    return this.fb.group({
      bankCode: this.fb.control<string | null>(
        service ? service.bankCode : null,
        Validators.required
      ),
      description: this.fb.control<string | null>(
        service ? service.description : null,
        Validators.required
      ),
      amount: this.fb.control<number | null>(service ? service.amount : null, Validators.required),
      price: this.fb.control<number | null>(service ? service.price : null, Validators.required),
      discount: this.fb.control<number | null>(
        service ? service.discount : null,
        Validators.required
      ),
      value: this.fb.control<number | null>(
        { value: service ? service.value : null, disabled: true },
        Validators.required
      ),
    });
  }

  addPurchasesInvoiceItemRow(item?: any) {
  const newRow = this.purchasesInvoiceItemRow(item ? item : null);
  this.purchasesInvoiceForm.controls.purchasesInvoiceItems.push(newRow);
}
  addPurchasesInvoiceServicesRow(service?: any) {
    const newRow = this.purchasesInvoiceServicesRow(service);
    this.purchasesInvoiceForm.controls.purchasesInvoiceServices.push(newRow);

    const calculateValue = () => {
      const discount = Number(newRow.controls.discount.value) / 100;
      const price = Number(newRow.controls.price.value);
      const amount = Number(newRow.controls.amount.value);
      const value = (price - price * discount) * amount;
      newRow.controls.value.patchValue(Number(value.toFixed(2)));
    };

    newRow.controls.price.valueChanges.subscribe(calculateValue);
    newRow.controls.discount.valueChanges.subscribe(calculateValue);
    newRow.controls.amount.valueChanges.subscribe(calculateValue);
  }

  removePurchasesInvoiceItemRow(index: number) {
    this.totalItemValue -= this.purchasesInvoiceForm.controls.purchasesInvoiceItems.controls[
      index
    ].controls.value.value!;
    this.purchasesInvoiceForm.controls.purchasesInvoiceItems.removeAt(index);
    // this.purchasesInvoiceForm.controls.total_Value_Items.patchValue(this.totalItemValue)
  }
  removePurchasesInvoiceServicesRow(index: number) {
    this.totalServiceValue -= this.purchasesInvoiceForm.controls.purchasesInvoiceServices.controls[
      index
    ].controls.value.value!;
    this.purchasesInvoiceForm.controls.purchasesInvoiceServices.removeAt(index);
    // this.purchasesInvoiceForm.controls.total_Value_Services.patchValue(this.totalServiceValue)
  }

  getAvailableItemsByStoreId(id: number, itemId?: number) {
    this.storeService.getAvailableItemsByStoreId(id).subscribe((res) => {
      this.availableItems = res.responseData.items || [];
      this.selectedItem = [this.availableItems.find((item) => item.id === itemId)];
    });
  }

  getAvailableItemsByStoreIdData(id: number, i: number) {
    this.purchasesInvoiceForm.controls.purchasesInvoiceItems.controls[i].controls.itemId.patchValue(
      id
    );
    this.selectedItem = [this.availableItems.find((item) => item.id === id)];
  }
  getAvailableItemsByStoreIdDataInEditing(id: number, i: number) {
    this.purchasesInvoiceForm.controls.purchasesInvoiceItems.controls[i].controls.itemId.patchValue(
      id
    );
  }
  buildPayload() {
    const payload: IPurchaseInvoicePayload = {
      id: +this.purchaseInvoiceId,
      documentNo: Number(this.purchasesInvoiceForm.controls.documentNo.getRawValue()),
      providerInvoiceNo: Number(this.purchasesInvoiceForm.controls.providerInvoiceNo.getRawValue()),
      supplyOrderNo: this.purchasesInvoiceForm.controls.supplyOrderNo.getRawValue()!,
      notes: this.purchasesInvoiceForm.controls.notes.getRawValue()!,
      paymentMethod: this.purchasesInvoiceForm.controls.paymentMethod.getRawValue()!,
      invoiceDate: this.purchasesInvoiceForm.controls.invoiceDate.getRawValue()!,
      providesId: this.purchasesInvoiceForm.controls.providesId.getRawValue()!,
      total_Value_Items: 0,
      total_Value_Services: 0,
      saleTax: 0,
      purchaseTax: 0,
      netInvoice: 0,

      purchasesInvoiceItems: this.purchasesInvoiceForm.controls.purchasesInvoiceItems
        .getRawValue()
        .map((item) => {
          return {
            requiredQuantity: item.requiredQuantity!,
            quantityAvailable: item.quantityAvailable!,
            price: item.price!,
            discount: item.discount!,
            value: item.value!,
            storeId: item.storeId!,
            itemId: item.itemId!,
          };
        }),
      purchasesInvoiceServices: this.purchasesInvoiceForm.controls.purchasesInvoiceServices
        .getRawValue()
        .map((item) => {
          return {
            bankCode: item.bankCode!,
            description: item.description!,
            amount: item.amount!,
            price: item.price!,
            discount: item.discount!,
            value: item.value!,
          };
        }),
    };
    if (!payload.id) {
      delete payload.id;
    }
    return payload;
  }

  // Update your addPurchaseInvoice method to use the modal
addPurchaseInvoice(createPermissions: boolean = false) {
  if (this.purchasesInvoiceForm.invalid) {
    this.purchasesInvoiceForm.markAllAsTouched();
    this.messageService.toast('من فضلك اِملأْ الحقول المطلوبة', 'error');
    return;
  }

  const payload = this.buildPayload();
  this.purchaseInvoiceService.addPurchaseInvoice(payload).subscribe({
    next: (res) => {
      if (res.isSuccess) {
        this.messageService.toast('تم اضافة الفاتورة بنجاح', 'success');
        this.currentInvoiceId = res.responseData.id; // Store the ID globally
        
        if (createPermissions) {
          this.createAdditionPermissions(); // Create permissions after invoice is created
        } else {
          this.router.navigate([
            `${appRoutes.purchasesInvoice.base}/${appRoutes.purchasesInvoice.grid}`,
          ]);
        }
      } else {
        this.messageService.toast(res.message, 'error');
      }
    },
    error: (err) => {
      this.messageService.toast(err.message, 'error');
    },
  });
}

  saveEdit() {
    if (this.purchasesInvoiceForm.invalid) {
      this.purchasesInvoiceForm.markAllAsTouched();
      this.messageService.toast('من فضلك اِملأْ الحقول المطلوبة', 'error');
      return;
    }

    const payload = this.buildPayload();

    this.purchaseInvoiceService.editPurchaseInvoice(payload).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.messageService.toast('تم تعديل الفاتورة بنجاح', 'success');
          this.router.navigate([
            `${appRoutes.purchasesInvoice.base}/${appRoutes.purchasesInvoice.grid}`,
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

  doubleClickSave() {
    this.saveEdit();
    this.saveEdit();
  }

 async getPurchaseInvoiceById(id: number) {
  try {
    const res = await this.purchaseInvoiceService.getPurchaseInvoiceById(id).toPromise();
    
    if (res?.isSuccess) {
      // Process items and services
      res.responseData.purchasesInvoiceItems.forEach((item) => {
        this.addPurchasesInvoiceItemRow(item);
      });
      res.responseData.purchasesInvoiceItems.forEach((service) => {
        this.addPurchasesInvoiceServicesRow(service);
      });
      
      this.patchFormValue(res.responseData);

      // Process transaction permissions
      if (res.responseData.transactionPermissions) {
        this.transactionPermissions = res.responseData.transactionPermissions;
        await this.loadStoreDisplays(); // Now this is properly awaited
      }
    } else {
      this.messageService.toast(res?.message || 'Unknown error', 'error');
    }
  } catch (err:any) {
    this.messageService.toast(err.message || 'Failed to load invoice', 'error');
  }
}

  patchFormValue(purchaseInvoice: IPurchaseInvoicePayload) {
    this.purchasesInvoiceForm.controls['documentNo'].setValue(purchaseInvoice.documentNo);
    this.purchasesInvoiceForm.controls['providerInvoiceNo'].setValue(
      purchaseInvoice.providerInvoiceNo
    );
    this.purchasesInvoiceForm.controls['supplyOrderNo'].setValue(purchaseInvoice.supplyOrderNo);
    this.purchasesInvoiceForm.controls['notes'].setValue(purchaseInvoice.notes);
    this.purchasesInvoiceForm.controls['paymentMethod'].setValue(purchaseInvoice.paymentMethod);
    this.purchasesInvoiceForm.controls['invoiceDate'].setValue(
      this.formatDate(purchaseInvoice.invoiceDate)
    );
    this.purchasesInvoiceForm.controls['providesId'].setValue(purchaseInvoice.providesId);

    // Patch purchasesInvoiceItems
    const itemsFormArray = this.purchasesInvoiceForm.get('purchasesInvoiceItems') as FormArray;
    itemsFormArray.clear();
    purchaseInvoice.purchasesInvoiceItems.forEach((item) => {
      const newItem = this.purchasesInvoiceItemRow(item);
      itemsFormArray.push(newItem);
      this.getAvailableItemsByStoreId(item.storeId, item.itemId);
      this.getAvailableItemsByStoreIdDataInEditing(
        item.itemId,
        purchaseInvoice.purchasesInvoiceItems.indexOf(item)
      );
      
      // Trigger initial calculation
      this.setupValueCalculation(newItem);
    });

    // Patch purchasesInvoiceServices
    const servicesFormArray = this.purchasesInvoiceForm.get(
      'purchasesInvoiceServices'
    ) as FormArray;
    servicesFormArray.clear(); // Clear existing services
    purchaseInvoice.purchasesInvoiceServices.forEach((service) => {
      servicesFormArray.push(this.purchasesInvoiceServicesRow(service));
    });
  }


  getAllTotalValueItem() {
    this.totalItemValue = 0;
    for (let i = 0; i < this.purchasesInvoiceForm.controls.purchasesInvoiceItems.length; i++) {
      this.totalItemValue += this.purchasesInvoiceForm.controls.purchasesInvoiceItems.controls[
        i
      ].controls.value.value;
    }
    // this.purchasesInvoiceForm.controls.total_Value_Items.patchValue(this.totalItemValue)
  }
  getAllTotalValueService() {
    this.totalServiceValue = 0;
    for (let i = 0; i < this.purchasesInvoiceForm.controls.purchasesInvoiceServices.length; i++) {
      this.totalServiceValue += this.purchasesInvoiceForm.controls.purchasesInvoiceServices.controls[
        i
      ].controls.value.value;
    }
    // this.purchasesInvoiceForm.controls.total_Value_Services.patchValue(this.totalServiceValue)
  }
  formatDate(date: string) {
    let stringDate = new Date(date);
    const day = stringDate
      .getDate()
      .toString()
      .padStart(2, '0');
    const month = (stringDate.getMonth() + 1).toString().padStart(2, '0');
    const year = stringDate.getFullYear();
    return `${year}-${month}-${day}`;
  }

  calculateTotal(): number {
    let itemsTotal = 0;
    let servicesTotal = 0;
  
    // Calculate items total
    if (this.purchasesInvoiceForm.controls.purchasesInvoiceItems) {
      itemsTotal = this.purchasesInvoiceForm.controls.purchasesInvoiceItems.controls
        .map(item => item.controls.value.value || 0)
        .reduce((acc, value) => acc + value, 0);
    }
  
    // Calculate services total
    if (this.purchasesInvoiceForm.controls.purchasesInvoiceServices) {
      servicesTotal = this.purchasesInvoiceForm.controls.purchasesInvoiceServices.controls
        .map(service => service.controls.value.value || 0)
        .reduce((acc, value) => acc + value, 0);
    }
  
    return itemsTotal + servicesTotal;
  }


showConfirmationModal() {
  if (this.purchasesInvoiceForm.invalid) {
    this.purchasesInvoiceForm.markAllAsTouched();
    this.messageService.toast('من فضلك اِملأْ الحقول المطلوبة', 'error');
    return;
  }

  if (this.purchasesInvoiceForm.controls.purchasesInvoiceItems.length > 0) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.message = 'هل استلمت الأصناف و تريد انشاء اذون الاضافة؟';
    
    modalRef.result.then(
      (result) => {
        if (result === 'yes') {
          this.addPurchaseInvoice(true); // Pass true to indicate we want to create permissions
        } else {
          this.addPurchaseInvoice(false); // Pass false to indicate no permissions needed
        }
      },
      (dismissReason) => {
        this.addPurchaseInvoice(false); // Default to no permissions if modal is dismissed
      }
    );
  } else {
    this.addPurchaseInvoice(false); // No items means no permissions needed
  }
}

  createAdditionPermissions() {
    const items = this.purchasesInvoiceForm.controls.purchasesInvoiceItems.getRawValue();
    const provider = this.providers.find(p => p.id === this.purchasesInvoiceForm.controls.providesId.value);
    
    items.forEach(item => {
      const store = this.stores.find(s => s.id === item.storeId);
      const itemData = this.availableItems.find(i => i.id === item.itemId);
      
      const payload = {
        transactionID: MovementEnum.disburse, // Fixed value for addition
        transactionType:MovementEnum.add, 
        code: this.purchasesInvoiceForm.controls.documentNo.value, // Document number
        fileNumber: this.purchasesInvoiceForm.controls.documentNo.value, // Same as document number
        storeId: item.storeId, // Store from the row
        transactionPermissionsDate: new Date().toISOString().split('T')[0], // Current date
        agency: provider?.descriptionAr || '', // Provider name
        receiver: '', // Empty receiver
        transactionPermissionsDetails: [{
          itemID: item.itemId,
          barCodeId: item.itemId,
          code: itemData?.code || '',
          piece: item.requiredQuantity, // Required quantity
          package: 0, // Default 0
          descriptionAr: itemData?.descriptionAr || ''
        }],
        purchasesInvoiceId: this.currentInvoiceId
      };
  
      this.stockRequsitionService.addNewTransaction(payload).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.messageService.toast('تم إنشاء إذن الإضافة بنجاح', 'success');
          } else {
            this.messageService.toast(res.message, 'error');
          }
        },
        error: (err) => {
          this.messageService.toast(err.message, 'error');
        }
      });
    });

   this.router.navigate([
            `${appRoutes.purchasesInvoice.base}/${appRoutes.purchasesInvoice.grid}`,
          ]);
  }
  
// In your component class
getStoreDetails(storeId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    this.storeService.getStoreById(storeId).subscribe({
      next: (res) => {
        if (res.isSuccess && res.responseData) {
          resolve(`${res.responseData.code} - ${res.responseData.description}`);
        } else {
          resolve('--');
        }
      },
      error: (err) => {
        console.error('Error fetching store details:', err);
        resolve('--');
      }
    });
  });
}

async getStoreDisplay(storeId: string): Promise<string> {
  // Return cached value if available
  if (this.storeCache[storeId]) {
    return this.storeCache[storeId];
  }

  // Mark as loading to prevent duplicate requests
  this.loadingStores.add(storeId);

  try {
    const res = await this.storeService.getStoreById(storeId).toPromise();
    console.log("hi")
    if (res?.isSuccess && res.responseData) {
      const display = `${res.responseData.code} - ${res.responseData.description}`;
          console.log("hi" , display)
      this.storeCache[storeId] = display; // Cache the result
      return this.storeCache[storeId];
    }
    return '--';
  } catch (err) {
    console.error('Error fetching store:', err);
    return '--';
  } finally {
    this.loadingStores.delete(storeId);
  }
}


// Add this method to pre-fetch store data
async loadStoreDisplays(): Promise<void> {
  const storeIds = this.transactionPermissions
    .map(p => p.storeId)
    .filter((id, index, arr) => id && arr.indexOf(id) === index);

  await Promise.all(storeIds.map(async id => {
    if (!this.storeDisplayCache[id]) {
      try {
        const res = await this.storeService.getStoreById(id).toPromise();
        if (res?.isSuccess) {
          this.storeDisplayCache[id] = `${res.responseData.code} - ${res.responseData.description}`;
        } else {
          this.storeDisplayCache[id] = '--';
        }
      } catch (err) {
        this.storeDisplayCache[id] = '--';
      }
    }
  }));
}
}


