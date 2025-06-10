import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemsService } from '@app/shared/service/items.service';
import { ICategory } from '@app/shared/models/ICategory';
import { CategoriesService } from '@app/shared/service/categories.service';
import { CategoryTypeEnum } from '@app/shared/enums/Item';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { IPriceListForItem } from '@app/shared/models/IPriceList';
import { appRoutes } from '@app/shared/routers/appRouters';
import { MessagesService } from '@app/shared/service/messages.service';
import { PriseListService } from '@app/shared/service/prise-list.service';
import { IItemForStores } from '../../models/IStroe';
import { StoreService } from '@app/shared/service/store.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddStockOfItemsComponent } from '../add-stock-of-items/add-stock-of-items.component';
@Component({
  selector: 'app-store-edit',
  templateUrl: './store-edit.component.html',
  styleUrls: ['./store-edit.component.scss'],
})
export class StoreEditComponent {
  storeId!: string;

  subsCategories!: ICategory[];
  categoryType = CategoryTypeEnum;
  categoryId: number | null = null;
  itemsListForStoreForm!: FormGroup;
  storeListForItem!: IItemForStores[];
  currentPage: number = 1;
  totalRecords!: number;
  goBackLink = `/${appRoutes.store.base}/${appRoutes.store.grid}`;
  pageSizes = [10, 25, 50];
  pageSize: number = 10;

  constructor(
    private storeService: StoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoriesService: CategoriesService,
    private fb: FormBuilder,
    private messageServie: MessagesService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getAllSubCategories();
    this.activatedRoute.paramMap.subscribe((params) => {
      this.storeId = params.get('id') ?? '';
    });

    this.initItemsListForStore();
    this.getItemsListForStoreTable();

    this.handlePageSizeChange();
    this.handleCategoryChange();
  }

  handleCategoryChange() {
    this.itemsListForStoreForm.controls['categoryId'].valueChanges.subscribe((value) => {
      this.categoryId = value ?? '';
      this.updateGrid();
    });
  }
  handlePageSizeChange() {
    this.itemsListForStoreForm.controls['pageSizeSelect'].valueChanges.subscribe((value) => {
      this.pageSize = value;
      this.currentPage = 1;
      this.updateGrid();
    });
  }

  updateGrid() {
    this.currentPage = 1;
    this.getItemsListForStoreTable();
  }

  getStoreWithId(id: string) {
    this.storeService.getStoreById(id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.itemsListForStoreForm.patchValue(res.responseData);
        }
      },
    });
  }

  initItemsListForStore() {
    this.itemsListForStoreForm = this.fb.group({
      storeListFormArray: this.fb.array([]),
      categoryId: this.fb.control(''),
      code: this.fb.control(''),
      description: this.fb.control(''),
      responsible: this.fb.control(''),
      location: this.fb.control(''),
      phone: this.fb.control(''),
      pageSizeSelect: this.fb.control(this.pageSize),
    });
    this.getStoreWithId(this.storeId);
  }

  get storeListFormArray() {
    return this.itemsListForStoreForm.get('storeListFormArray') as FormArray;
  }

  editItem() {
    const updatedStore = { ...this.itemsListForStoreForm.value, id: this.storeId };
    this.storeService.editStroe(updatedStore).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.messageServie.toast(res.responseData);
          this.router.navigate([`/${appRoutes.store.base}/${appRoutes.store.grid}`]);
        }
      },
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getItemsListForStoreTable();
  }

  getItemsListForStoreTable() {
    const paginationFilter = { pageNumber: this.currentPage, pageSize: this.pageSize };
    this.storeService
      .getItemsListForStoreTable(this.storeId, paginationFilter, this.categoryId)
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.storeListForItem = res.responseData.items;
            this.totalRecords = res.responseData.count;
            this.addItemsListToFormArray();
          }
        },
      });
  }

  addItemsListToFormArray() {
    this.storeListFormArray.clear();
    this.storeListForItem.forEach((item) => {
      this.storeListFormArray.push(
        this.fb.group({
          id: item.id,
          itemName: item.itemName,
          currentAvailableBalancePackage: item.currentAvailableBalancePackage,
          currentAvailableBalancePiece: item.currentAvailableBalancePiece,
          balanceFirstPeriodPiece: item.balanceFirstPeriodPiece,
          balanceFirstPeriodPackage: item.balanceFirstPeriodPackage,
          reservedQuantityPiece: item.reservedQuantityPiece,
          reservedQuantityPackage: item.reservedQuantityPackage,
          minimumPiece: item.minimumPiece,
          minimumPackage: item.minimumPackage,
        })
      );
    });
  }

  getAllSubCategories() {
    this.categoriesService
      .getAllCategories(10000, 1, [this.categoryType.SubMain])
      .subscribe((res) => {
        this.subsCategories = res.responseData.items;
      });
  }

  acceptNumbersOnly(event: any, formControlName: string, index: number) {
    let value = event.target.value.replace(/[^\d.]/g, '');
    const text: any = [];
    for (let char of value) {
      if (!isNaN(parseInt(char, 10)) || char === '.') {
        text.push(char);
      }
    }
    let finalValue = text.join('');
    this.storeListFormArray
      .at(index)
      .get(formControlName)
      ?.setValue(+finalValue);
  }

  // addItemsDataToStore(itemData: any) {
  //   const modalRef = this.modalService.open(AddStockOfItemsComponent, {
  //     size: 'lg',
  //     centered: true,
  //   });
  //   console.log(itemData);

  //   modalRef.componentInstance.storeId = this.storeId;
  //   modalRef.componentInstance.itemData = itemData;
  //   modalRef.componentInstance.ItemData = modalRef.result.then((result) => {
  //     this.getItemsListForStoreTable();
  //   });
  // }

  // new method to handle immediate updates
  updateItemStock(index: number) {
    const itemFormGroup = this.storeListFormArray.at(index) as FormGroup;
    
    if (itemFormGroup.invalid) {
      this.messageServie.toast('من فضلك أدخل قيم صحيحة', 'error');
      return;
    }

    const itemData = {
      itemId: Number(itemFormGroup.value.id),
      storeId: Number(this.storeId),
      minimumPiece: itemFormGroup.value.minimumPiece,
      minimumPackage: itemFormGroup.value.minimumPackage,
      reservedQuantityPiece: itemFormGroup.value.reservedQuantityPiece,
      reservedQuantityPackage: itemFormGroup.value.reservedQuantityPackage
    };

    this.storeService.addStockOfItems([itemData]).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.messageServie.toast('تم تحديث الكمية بنجاح', 'success');
        } else {
          this.messageServie.toast('حدث خطأ أثناء التحديث', 'error');
        }
      },
      error: () => {
        this.messageServie.toast('حدث خطأ في الاتصال', 'error');
      }
    });
  }
}
