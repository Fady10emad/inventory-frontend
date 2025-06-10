import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CategoryTypeEnum,
  DiscountEnum,
  DiscountTypeEnum,
  TransactionCloseEnum,
  PurchaseTaxEnum,
  SaleTaxEnum,
  PaymentMethodEnum,
} from '@app/shared/enums/Item';
import { ICategory } from '@app/shared/models/ICategory';
import { ILookup } from '@app/shared/models/ILookup';
import { IPriceListForItem } from '@app/shared/models/IPriceList';
import { IProvider } from '@app/shared/models/IProvider';
import { MessagesService } from '@app/shared/service/messages.service';
import { ProviderService } from '@app/shared/service/provider.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddProviderAreaComponent } from './add-provider-area/add-provider-area.component';
import { AddProviderCategoryComponent } from './add-provider-category/add-provider-category.component';
import { AddProviderCurrencyComponent } from './add-provider-currency/add-provider-currency.component';
import { appRoutes } from '@app/shared/routers/appRouters';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss'],
})
export class AddVendorComponent {
  priceList!: IPriceListForItem[];

  constructor(
    private fb: FormBuilder,
    private messageServie: MessagesService,
    private providerService: ProviderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {}
  vendorId!: string;
  vendorInfo!: IProvider;
  vendorForm!: FormGroup;
  subsCategories!: ICategory[];
  categoryType = CategoryTypeEnum;
  discount = DiscountEnum;
  discountType = DiscountTypeEnum;
  transactionClose = TransactionCloseEnum;
  PaymentMethod = PaymentMethodEnum;
  purchaseTaxEnum = PurchaseTaxEnum;
  saleTaxEnum = SaleTaxEnum;
  Currency!: ILookup[];
  ProviderCategory!: ILookup[];
  Area!: ILookup[];
  isEdit: boolean = false;
  isView: boolean = false;

  ngOnInit(): void {
    this.initVendorForm();
    this.isEditRoute();
    this.getAllProviderCat();
    this.getAllProviderCurrency();
    this.getAllProviderArea();
    this.providerService.onAddArea.subscribe((val) => {
      if (val) {
        this.getAllProviderArea();
      }
    });
    this.providerService.onAddCategory.subscribe((val) => {
      if (val) {
        this.getAllProviderCat();
      }
    });
    this.providerService.onAddCurrrency.subscribe((val) => {
      if (val) {
        this.getAllProviderCurrency();
      }
    });
  }

  isEditRoute(): void {
    const currentRoute = this.activatedRoute.snapshot.url.map((segment) => segment.path);

    this.isEdit = currentRoute.includes('edit') ? true : false;
    if (this.isEdit) {
      this.vendorId = this.activatedRoute.snapshot.params['id'];
      this.getVendorById(this.vendorId);
      // this.disableNotEditableInputs();
    }
    this.isView = currentRoute.includes('view') ? true : false;
    this.disableForm();
  }

  disableForm() {
    if (this.isView) {
      this.vendorForm.disable();
    }
  }

  // disableNotEditableInputs() {
  //   this.vendorForm.get('providorDiscount')?.disable();
  //   this.vendorForm.get('paymentPeriod')?.disable();
  // }

  initVendorForm() {
    this.vendorForm = this.fb.group({
      code: this.fb.control(null, [Validators.required]),
      name: this.fb.control(null, [Validators.required]),
      descriptionAr: this.fb.control(null, [Validators.required]),
      competentoffice: this.fb.control(null, [Validators.required]),
      taxRegistrationNumber: this.fb.control(null, [Validators.required]),
      purchaseTax: this.fb.control(null, [Validators.required]),
      discountTaxItems: this.fb.control(null, [Validators.required]),
      discountTaxServices: this.fb.control(null, [Validators.required]),
      closeDealings: this.fb.control(this.transactionClose.No),
      responsible: this.fb.control(null),
      paymentMethod: this.fb.control(this.PaymentMethod.cash),
      providerDiscount: [0],
      paymentPeriod: this.fb.control(1),
      phone: this.fb.control(null),
      email: this.fb.control(null),
      address: this.fb.control(null),
      areaId: this.fb.control(null),
      currencyId: this.fb.control(null),
      providerCategoryId: this.fb.control(null),
      taxFileNumber: this.fb.control(null),
      // valueAddedTaxServices: this.fb.control(null, [Validators.required]),
      // valueAddedTaxItems: this.fb.control(null, [Validators.required]),
    });
  }

  onSubmit(): void {
    const newprovider: IProvider = {
      ...this.vendorForm.value,
    };

    if (!this.vendorForm.valid) {
      this.messageServie.toast('من فضلك اِملأْ الحقول المطلوبة', 'error');
      this.vendorForm.markAllAsTouched();
      return;
    }

    this.providerService.addNewProvider(newprovider).subscribe((res) => {
      if (res.isSuccess) {
        this.messageServie.toast('تم اضافة مورد', 'success');
        this.vendorForm.reset();
        this.router.navigate([`${appRoutes.vendor.base}/${appRoutes.vendor.grid}`]);
      } else {
        this.messageServie.toast('حدث خطأ ما', 'error');
      }
    });
  }

  addAnotherCat() {
    const modalRef = this.modalService.open(AddProviderCategoryComponent, {
      size: 'sm',
      centered: true,
    });
  }

  addAnotherCurrency() {
    const modalRef = this.modalService.open(AddProviderCurrencyComponent, {
      size: 'sm',
      centered: true,
    });
  }

  addAnotherArea() {
    const modalRef = this.modalService.open(AddProviderAreaComponent, {
      size: 'sm',
      centered: true,
    });
  }

  getAllProviderCat(): void {
    this.providerService.getProviderProviderCategory().subscribe((res) => {
      this.ProviderCategory = res.body?.responseData || [];
    });
  }

  getAllProviderCurrency(): void {
    this.providerService.getProviderCurrency().subscribe((res) => {
      this.Currency = res.body?.responseData || [];
    });
  }

  getAllProviderArea(): void {
    this.providerService.getProviderArea().subscribe((res) => {
      this.Area = res.body?.responseData || [];
    });
  }

  getVendorById(id: any) {
    this.providerService.getProviderById(id).subscribe((res) => {
      this.vendorInfo = res.responseData;
      this.vendorForm.patchValue(this.vendorInfo);
    });
  }

  saveEdit() {
    if (this.vendorForm.invalid) {
      this.messageServie.toast('من فضلك اِملأْ الحقول المطلوبة', 'error');
      this.vendorForm.markAllAsTouched();
      return;
    }

    const updatedProvider: IProvider = {
      ...this.vendorForm.value,
      id: +this.vendorId,
    };

    this.providerService.editProvider(updatedProvider).subscribe((res) => {
      if (res.isSuccess && res.responseData) {
        this.messageServie.toast('تم الحفظ بنجاح', 'success');
        this.router.navigate([`${appRoutes.vendor.base}/${appRoutes.vendor.grid}`]);
      } else {
        this.messageServie.toast(res.message, 'error');
      }
    });
  }
}
