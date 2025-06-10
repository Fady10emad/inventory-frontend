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
import { IModifiedPriceItems } from '../models';

@Component({
  selector: 'app-items-for-price-list',
  templateUrl: './items-for-price-list.component.html',
  styleUrls: ['./items-for-price-list.component.scss'],
})
export class ItemsForPriceListComponent implements OnInit {
  priceListId!: string;
  priceList!: IPriceListForItem[];
  priceListForm!: FormGroup;

  subsCategories!: ICategory[];
  categoryType = CategoryTypeEnum;
  categoryId: number | null = null;

  currentPage: number = 1;
  totalRecords!: number;
  pageSizes = [10, 25, 50];
  pageSize: number = 10;

  searchResults: any[] = []; // To store search results
  isSearchMode: boolean = false; // To track if we're in search mode

  priceListGridLink = `/${appRoutes.priceList.base}/${appRoutes.priceList.grid}`;

  constructor(
    private itemsService: ItemsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoriesService: CategoriesService,
    private fb: FormBuilder,
    private messageServie: MessagesService,
    private priceListService: PriseListService
  ) {}

  ngOnInit(): void {
    this.getAllCategories();

    this.activatedRoute.paramMap.subscribe((params) => {
      this.priceListId = params.get('id') ?? '';
    });

    this.initpriceListForm();
    this.getAllItemPriceByPriceListId();

    this.priceListForm.controls['categoryId'].valueChanges.subscribe((value) => {
      this.categoryId = value ?? '';
      this.changeCurrentPasge(1);
      this.updateGrid();
    });

    this.priceListForm.controls['pageSizeSelect'].valueChanges.subscribe((value) => {
      this.pageSize = value;
      this.changeCurrentPasge(1);
      this.updateGrid();
    });
  }

  changeCurrentPasge(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  updateGrid() {
    this.getAllItemPriceByPriceListId();
    this.saveModifiedItems();
  }

  getAllCategories() {
    this.categoriesService
      .getAllCategories(10000, 1, [this.categoryType.SubMain])
      .subscribe((res) => {
        this.subsCategories = res.responseData.items;
      });
  }

  getPriceListById(id: string) {
    this.priceListService.getPriceListById(id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.priceListForm.patchValue(res.responseData.items[0]);
        }
      },
    });
  }

  initpriceListForm() {
    this.priceListForm = this.fb.group({
      priceListArray: this.fb.array([]),
      categoryId: this.fb.control(''),
      code: this.fb.control({ value: '', disabled: true }),
      description: this.fb.control(''),
      profitabilityRatio: this.fb.control({ value: '', disabled: true }),
      pageSizeSelect: this.fb.control(this.pageSize),
      itemSearch: this.fb.control(''),
    });
    this.getPriceListById(this.priceListId);
  }

  get priceListFormArray() {
    return this.priceListForm.get('priceListArray') as FormArray;
  }

    // Modify your save methods to handle search mode
    savePageChanges() {
      // First update the price list description
      const priceListDescriptionUpdate = {
        id: this.priceListId,
        description: this.priceListForm.get('description')?.value
      };
    
      this.priceListService.updatePriceListDescription(priceListDescriptionUpdate).subscribe({
        next: (descRes) => {
          if (descRes.isSuccess) {
            // Then handle the item price updates
            const modifiedPriceItems = this.getChangedItems();
            if (modifiedPriceItems.length > 0) {
              this.itemsService.addItemPrices(modifiedPriceItems).subscribe({
                next: (priceRes) => {
                  if (priceRes.isSuccess) {
                    this.messageServie.toast('تم تعديل الاسعار والوصف بنجاح', 'success');
                    if (this.isSearchMode) {
                      this.onSearch();
                    } else {
                      this.getAllItemPriceByPriceListId();
                    }
                  } else {
                    this.messageServie.toast(priceRes.message, 'error');
                  }
                },
                error: (priceErr) => {
                  this.messageServie.toast(priceErr.message, 'error');
                }
              });
            } else {
              this.messageServie.toast('تم تحديث الوصف بنجاح', 'success');
              this.router.navigate([appRoutes.priceList.base, appRoutes.priceList.grid]);
            }
          } else {
            this.messageServie.toast(descRes.message, 'error');
          }
        },
        error: (descErr) => {
          this.messageServie.toast(descErr.message, 'error');
        }
      });
    }

  saveModifiedItems() {
    const modifiedPriceItems = this.getChangedItems();
    if (modifiedPriceItems.length > 0) {
      this.itemsService.addItemPrices(modifiedPriceItems).subscribe();
    }
  }

  onPageChange(page: number) {
    this.saveModifiedItems();
    this.changeCurrentPasge(page);
    this.getAllItemPriceByPriceListId();
  }

  getAllItemPriceByPriceListId() {
    const paginationFilter = { pageNumber: this.currentPage, pageSize: this.pageSize };
    this.itemsService
      .getItemsPriceForPriceListTable(this.priceListId, paginationFilter, this.categoryId)
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.priceList = res.responseData.items;
            this.totalRecords = res.responseData.count;
            this.addPriceListFormGroupToFormArray();
          }
        },
      });
  }

  addPriceListFormGroupToFormArray() {
    this.priceListFormArray.clear();
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

  getChangedItems() {
    const modifiedPriceItems: IModifiedPriceItems[] = [];
    this.priceListFormArray.controls.forEach((control) => {
      if (control.dirty) {
        modifiedPriceItems.push({
          pricelistId: this.priceListId,
          itemId: control.value.id,
          itemPrice: control.value.price ?? 0,
        });
      }
    });
    return modifiedPriceItems;
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
    this.priceListFormArray
      .at(index)
      .get(formControlName)
      ?.setValue(+finalValue);
  }

  onSearch(): void {
    const searchValue = this.priceListForm.controls['itemSearch'].value.trim();
    
    if (searchValue) {
      this.isSearchMode = true;
      this.itemsService.searchItems(searchValue).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.searchResults = res.responseData;
            this.displaySearchResults();
          }
        },
        error: (err) => {
          this.messageServie.toast(err.message, 'error');
        }
      });
    } else {
      // If search is empty, return to normal mode
      this.isSearchMode = false;
      this.getAllItemPriceByPriceListId();
    }
  }

  displaySearchResults(): void {
    this.priceListFormArray.clear();
    
    this.searchResults.forEach(item => {
      // Check if this item already exists in the price list
      const existingItem = this.priceList?.find(pl => pl.id === item.id);
      
      this.priceListFormArray.push(
        this.fb.group({
          id: item.id,
          priceListDescription: existingItem?.priceListDescription || '',
          itemName: item.descriptionAr || item.descriptionEn || '',
          price: existingItem?.price || 0
        })
      );
    });
    
    this.totalRecords = this.searchResults.length;
  }

}
