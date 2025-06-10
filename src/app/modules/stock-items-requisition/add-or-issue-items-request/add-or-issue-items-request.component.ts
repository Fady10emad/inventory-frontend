import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ITransaction } from '@app/modules/items/models/IAddDismissalNotice';
import { IStore } from '@app/modules/store/models/IStroe';
import { MovementEnum } from '@app/shared/enums/Item';
import { appRoutes } from '@app/shared/routers/appRouters';
import { DismissalNoticeService } from '@app/shared/service/dismissal-notice.service';
import { ItemsService } from '@app/shared/service/items.service';
import { MessagesService } from '@app/shared/service/messages.service';
import { StockRequsitionService } from '@app/shared/service/stock-requsition.service';
import { StoreService } from '@app/shared/service/store.service';
import { PurchaseInvoiceService } from '@app/shared/service/purchase-invoice.service';
import {
  Observable,
  Subject,
  catchError,
  concat,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-add-or-issue-items-request',
  templateUrl: './add-or-issue-items-request.component.html',
  styleUrls: ['./add-or-issue-items-request.component.scss'],
})
export class AddOrIssueItemsRequestComponent implements OnInit {
  isEdit = false;
  isAddRequest = false;
  availableStoresOptions: IStore[] = [];
  movments: ITransaction[] = [];
  foundItems: any[] = [];
  invoices: any[] = [];

  availableItems$!: Observable<any[]>;
  itemSearchInput$ = new Subject<string>();
  itemsLoading: boolean = false;

  backLink!: string;
  purchaseInvoice: any;
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storeService: StoreService,
    private stockRequsitionService: StockRequsitionService,
    private itemsService: ItemsService,
    private messageService: MessagesService,
    private PurchaseInvoiceService: PurchaseInvoiceService
  ) {}

  itemsStockRequsitionForm = this.fb.group({
    id: this.fb.control<number | null>(null),
    transactionID: this.fb.control<number | null>(null, [Validators.required]),
    code: this.fb.control('', [Validators.required]),
    fileNumber: this.fb.control('', [Validators.required]),
    storeId: this.fb.control<number | null>(null, [Validators.required]),
    transactionPermissionsDate: this.fb.control('', [Validators.required]),
    agency: this.fb.control('', [Validators.required]),
    receiver: this.fb.control('', [Validators.required]),
    transactionPermissionsDetails: this.fb.array([].map(this.itemRow)),
    invoiceNumber: this.fb.control<number | null>(null, [Validators.required]),
  });

  ngOnInit() {
    this.storeService.getAllStores({ pageSize: 100000, pageNumber: 1 }).subscribe((res) => {
      this.availableStoresOptions = res.body?.responseData.items || [];
    });

    this.activatedRoute.data.subscribe((data) => {
      this.isEdit = data['isEdit'] === true;
      if (this.isEdit) {
        this.subscribeToParamsForEdit();
      }
      this.handleAddOrIssueRequest(data['addOrIssue']);
    });

    this.getAllInvoices();
  }

  private subscribeToParamsForEdit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.itemsStockRequsitionForm.controls.id.setValue(params['id']);
      this.stockRequsitionService.getTransactionPermissionById(params['id']).subscribe((res) => {
        this.handleTransactionData(res);
      });
    });
  }

  private handleTransactionData(res: any): void {
    this.purchaseInvoice = res.responseData.purchasesInvoice;
    let foundItems: any[] = [];
    res.responseData.transactionPermissionsDetails.forEach((item: any) => {
      this.addItemRowWithItsListeners();
      this.disableItemControls();
      foundItems.push({
        id: item?.item?.id,
        code: item?.item?.code,
        barCode: item?.item?.barCode,
        descriptionAr: item?.item?.descriptionAr,
      });
    });
    this.foundItems = foundItems;
    this.availableItems$ = of(foundItems);
    this.patchFormValue(res.responseData);
  }

  private disableItemControls(): void {
    this.itemsStockRequsitionForm.controls.transactionPermissionsDetails.controls.forEach(
      (group) => {
        group.controls.itemID.disable();
        group.controls.barCodeId.disable();
      }
    );
  }

  private handleAddOrIssueRequest(addOrIssue: string): void {
    this.isAddRequest = addOrIssue === appRoutes.stockItemsRequisition.addItemsRequest;
    this.getMovments(this.isAddRequest ? MovementEnum.add : MovementEnum.disburse);
    this.backLink = `/${appRoutes.stockItemsRequisition.base}/${
      this.isAddRequest
        ? appRoutes.stockItemsRequisition.addItemsRequestGrid
        : appRoutes.stockItemsRequisition.issueItemsRequestGrid
    }`;
  }

  getMovments(movment: MovementEnum) {
    this.stockRequsitionService.getTransactionsByType(movment).subscribe((res) => {
      this.movments = res.responseData;
    });
  }

  patchFormValue(stockItemsRequisition: any) {
    this.itemsStockRequsitionForm.patchValue({
      id: stockItemsRequisition.id,
      transactionID: stockItemsRequisition.transactionID,
      code: stockItemsRequisition.code,
      fileNumber: stockItemsRequisition.fileNumber,
      storeId: stockItemsRequisition.storeId,
      transactionPermissionsDate: stockItemsRequisition?.transactionPermissionsDate?.split('T')[0],
      agency: stockItemsRequisition.agency,
      receiver: stockItemsRequisition.receiver,
      transactionPermissionsDetails: stockItemsRequisition?.transactionPermissionsDetails.map(
        (item: any) => {
          return {
            code: item?.item?.code,
            itemID: item?.item?.id,
            descriptionAr: item?.item?.descriptionAr,
            barCodeId: item?.item?.id,
            piece: item?.piece,
            package: item?.package,
          };
        }
      ),
      invoiceNumber: stockItemsRequisition.purchasesInvoice?.id || null,
    });
  }

  itemRow() {
    return this.fb.group({
      code: this.fb.control<string | null>(null, [Validators.required]),
      itemID: this.fb.control<number | null>(null, [Validators.required]),
      barCodeId: this.fb.control<number | null>(null, [Validators.required]),
      piece: this.fb.control<number | null>(null, [Validators.required]),
      package: this.fb.control<number | null>(null, [Validators.required]),
      descriptionAr: this.fb.control<string | null>(null),
    });
  }

  removeItemRow(i: number) {
    this.itemsStockRequsitionForm.controls.transactionPermissionsDetails.removeAt(i);
  }

  addItemRowWithItsListeners() {
    this.itemsStockRequsitionForm.controls.transactionPermissionsDetails.push(this.itemRow());

    this.itemsStockRequsitionForm.controls.transactionPermissionsDetails.controls.forEach(
      (formGroup) => {
        formGroup.controls.code.disable();
        formGroup.controls.itemID.valueChanges.subscribe((value) => {
          const item = this.foundItems.find((item) => item.id === value);
          if (item) {
            formGroup.controls.code.setValue(item.code);
            formGroup.controls.barCodeId.setValue(value, { emitEvent: false });
          }
        });
        formGroup.controls.barCodeId.valueChanges.subscribe((value) => {
          const item = this.foundItems.find((item) => item.id === value);
          if (item) {
            formGroup.controls.code.setValue(item.code);
            formGroup.controls.itemID.setValue(value, { emitEvent: false });
          }
        });
      }
    );

    this.loadItems();
  }

  private loadItems() {
    this.availableItems$ = concat(
      of([]), // default items
      this.itemSearchInput$.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        catchError(() => of([])),
        tap(() => (this.itemsLoading = true)),
        switchMap((term) => {
          if (term && typeof term === 'string') {
            return this.itemsService.searchItems(term).pipe(
              map((res) => {
                this.foundItems = res.responseData;
                return res.responseData;
              }),
              tap(() => (this.itemsLoading = false))
            );
          } else {
            return of([]);
          }
        })
      )
    );
  }

  private validateForm(): boolean {
    if (this.itemsStockRequsitionForm.invalid) {
      this.messageService.toast('يجب ادخال جميع البيانات', 'error');
      this.itemsStockRequsitionForm.markAllAsTouched();
      return false;
    }
    return true;
  }

  private navigateToGrid() {
    const route = this.isAddRequest
      ? appRoutes.stockItemsRequisition.addItemsRequestGrid
      : appRoutes.stockItemsRequisition.issueItemsRequestGrid;
    this.router.navigate(['/', appRoutes.stockItemsRequisition.base, route]);
  }

  private handleResponse(res: any, successMessage: string) {
    if (res.isSuccess) {
      this.messageService.toast(successMessage, 'success');
      this.navigateToGrid();
    } else {
      this.messageService.toast(res.message, 'error');
    }
  }

  private handleError(err: any) {
    this.messageService.toast(err.message, 'error');
  }

  editReqisition() {
    if (!this.validateForm()) return;

    const payload = {
      ...this.itemsStockRequsitionForm.getRawValue(),
      transactionType: this.isAddRequest ? MovementEnum.add : MovementEnum.disburse,
      id: this.itemsStockRequsitionForm.controls.id.getRawValue(),
      purchasesInvoiceId: this.itemsStockRequsitionForm.controls.invoiceNumber.getRawValue()
    };
     this.stockRequsitionService.editTransactionPermission(payload).subscribe({
    next: (res) => {
      if (res.isSuccess) {
        this.handleResponse(res, 'تم تعديل الاذن بنجاح');
      } else {
        // Show error message from backend if operation failed
        this.messageService.toast(res.message || 'فشل في تعديل الاذن', 'error');
      }
    },
    error: (err) => {
      // Show detailed error message
      const errorMessage = err.error?.message || err.message || 'حدث خطأ أثناء تعديل الاذن';
      this.messageService.toast(errorMessage, 'error');
    }
  });
  }

  addNewReqisition() {
    if (!this.validateForm()) return;

    const payload = {
      ...this.itemsStockRequsitionForm.getRawValue(),
      transactionType: this.isAddRequest ? MovementEnum.add : MovementEnum.disburse,
      purchasesInvoiceId: this.itemsStockRequsitionForm.controls.invoiceNumber.getRawValue()
    };

    this.stockRequsitionService.addNewTransaction(payload).subscribe({
    next: (res) => {
      if (res.isSuccess) {
        this.handleResponse(res, 'تم اضافة الاذن بنجاح');
      } else {
        // Show error message from backend if operation failed
        this.messageService.toast(res.message || 'فشل في اضافة الاذن', 'error');
      }
    },
    error: (err) => {
      // Show detailed error message
      const errorMessage = err.error?.message || err.message || 'حدث خطأ أثناء اضافة الاذن';
      this.messageService.toast(errorMessage, 'error');
    }
    });
  }

  // Add this method to generate the invoice link
  getInvoiceLink(): string {
    if (!this.purchaseInvoice?.id) return '#';
    return `${appRoutes.purchasesInvoice.base}/${appRoutes.purchasesInvoice.edit}/${this.purchaseInvoice.id}`;
  }

  getAllInvoices() {
    this.PurchaseInvoiceService.getAllPurchaseInvoice({
      pageSize: 100000,
      pageNumber: 1,
    }).subscribe({
      next: (res) => {
        // The API returns an array of invoices in responseData.items
        this.invoices = res.body?.responseData?.items || [];

        if (this.isEdit && this.purchaseInvoice) {
        this.itemsStockRequsitionForm.controls.invoiceNumber.setValue(this.purchaseInvoice.id);
      }
      },
      error: (err) => {
        this.messageService.toast(err.message, 'error');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
  showInvoiceDropdown = false;

  // Add this method to edit document number
  // editDocumentNumber() {
  //   const newNumber = prompt('أدخل رقم المستند الجديد:', this.purchaseInvoice.documentNo);
  //   if (newNumber && newNumber !== this.purchaseInvoice.documentNo) {
  //     this.isLoading = true;
  //     const payload = {
  //       id: this.purchaseInvoice.id,
  //       documentNo: Number(newNumber)
  //     };

  //     this.purchaseInvoiceService.editPurchaseInvoice(payload).subscribe({
  //       next: (res) => {
  //         if (res.isSuccess) {
  //           this.purchaseInvoice.documentNo = newNumber;
  //           this.messageService.toast('تم تحديث رقم المستند بنجاح', 'success');
  //         }
  //       },
  //       error: (err) => {
  //         this.messageService.toast('فشل في تحديث رقم المستند', 'error');
  //       },
  //       complete: () => {
  //         this.isLoading = false;
  //       }
  //     });
  //   }
  // }
}
