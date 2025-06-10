import { L10n } from '@syncfusion/ej2-base';
import { Component, OnInit } from '@angular/core';

import arAELocalization from '@shared/Json/locale-grid.json';

import { ICategory } from '@app/shared/models/ICategory';
import { CategoriesService } from '@app/shared/service/categories.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { appRoutes } from '@app/shared/routers/appRouters';
import { MessagesService } from '@app/shared/service/messages.service';
import { CategoryTypeEnum } from '@app/shared/enums/Item';
import { PageSettingsModel } from '@syncfusion/ej2-angular-grids';

L10n.load(arAELocalization);
@Component({
  selector: 'app-categories-grid',
  templateUrl: './categories-grid.component.html',
  styleUrls: ['./categories-grid.component.scss'],
})
export class CategoriesGridComponent implements OnInit {
  rowSourceData!: ICategory[];
  public locale: any = 'ar-AE';
  categoryType = CategoryTypeEnum;

  // addCategoryLink = `/categories/create`;
  createCategoryLink = `/${appRoutes.categories.base}/${appRoutes.categories.create}`;
  // addCategoryLink = ['/', appRoutes.categories.base, appRoutes.categories.create];
  // addCategoryLink = ['/' + appRoutes.categories.base + appRoutes.categories.create];
  pageSettings: PageSettingsModel = { pageSize: 25 };
  constructor(
    private categoriesService: CategoriesService,
    private router: Router,
    private messagesService: MessagesService
  ) {}
  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.categoriesService
      .getAllCategories(10000, 1, [this.categoryType.Main, this.categoryType.SubMain])
      .pipe(
        map((res) => {
          res.responseData.items.forEach((category) => {
            category.parentCategoryId = category.parentCategoryId || undefined;
          });
          return res;
        })
      )
      .subscribe((res) => {
        if (res.isSuccess) {
          this.rowSourceData = res.responseData.items;
        }
      });
  }

  editCategory(id: string) {
    this.router.navigate([`${appRoutes.categories.base}/${appRoutes.categories.edit}/${id}`]);
  }

  deleteCategory(id: string) {
    this.messagesService
      .templateComfirmation('هل متأكد من حذف هذه المجموعة ؟', '', 'موافق', 'الغاء', 'error')
      .then((result) => {
        if (result.isConfirmed) {
          this.deleteCate(id);
        }
      });
  }

  deleteCate(id: string) {
    this.categoriesService.deleteCategory(id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.messagesService.toast('تم حذف المجموعة بنجاح', 'success');
          this.getAllCategories();
        } else {
          this.messagesService.toast(res.message, 'error');
        }
      },
    });
  }
}
