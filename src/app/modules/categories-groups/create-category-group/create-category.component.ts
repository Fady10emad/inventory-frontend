import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ICategory } from '@app/shared/models/ICategory';
import { CategoriesService } from '@app/shared/service/categories.service';
import { MessagesService } from '@app/shared/service/messages.service';
import { map } from 'rxjs/operators';
import { appRoutes } from '@app/shared/routers/appRouters';
import { CategoryTypeEnum } from '@app/shared/enums/Item';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss'],
})
export class CreateCategoryComponent implements OnInit {
  createCategoryForm!: FormGroup;
  parentsCategories!: ICategory[];

  categoryType = CategoryTypeEnum;

  constructor(
    private fb: FormBuilder,
    private messageServie: MessagesService,
    private categoriesService: CategoriesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initCreateCategoryForm();
    this.categoriesService.getAllCategories(10000, 1, [this.categoryType.Main]).subscribe((res) => {
      this.parentsCategories = res.responseData.items;
    });

    this.handleCategoryTypeChange();
  }

  initCreateCategoryForm() {
    this.createCategoryForm = this.fb.group({
      code: [null],
      name_AR: [null, Validators.required],
      name_EN: [null, Validators.required],
      categoryTypeId: [1],
      parentCategoryId: [null],
    });
  }

  handleCategoryTypeChange() {
    this.createCategoryForm.get('categoryTypeId')?.valueChanges.subscribe((value) => {
      const parentCategoryIdControl = this.createCategoryForm.get('parentCategoryId');
      if (+value === this.categoryType.Main) {
        parentCategoryIdControl?.removeValidators([Validators.required]);
      } else if (+value === this.categoryType.SubMain) {
        parentCategoryIdControl?.setValidators([Validators.required]);
      }
      parentCategoryIdControl?.updateValueAndValidity();
    });
  }

  addNewCategory() {
    const newCategory: ICategory = {
      code: this.createCategoryForm.get('code')?.value,
      name_AR: this.createCategoryForm.get('name_AR')?.value,
      name_EN: this.createCategoryForm.get('name_EN')?.value,
      categoryTypeId: this.createCategoryForm.get('categoryTypeId')?.value,
      parentCategoryId: this.createCategoryForm.get('parentCategoryId')?.value || null,
    };

    if (!this.createCategoryForm.valid) {
      this.messageServie.toast('من فضلك اِملأْ الحقول المطلوبة', 'error');
      this.createCategoryForm.markAllAsTouched();
      return;
    }

    this.categoriesService.addNewCategory(newCategory).subscribe((res) => {
      if (res.isSuccess) {
        this.messageServie.toast('تم انشاء المجموعة', 'success');
        this.router.navigate([`${appRoutes.categories.base}/${appRoutes.categories.grid}`]);
      } else {
        this.messageServie.toast(res.message, 'error');
      }
    });
  }
}
