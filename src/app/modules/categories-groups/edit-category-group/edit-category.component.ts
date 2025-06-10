import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryTypeEnum } from '@app/shared/enums/Item';
import { ICategory } from '@app/shared/models/ICategory';
import { appRoutes } from '@app/shared/routers/appRouters';
import { CategoriesService } from '@app/shared/service/categories.service';
import { MessagesService } from '@app/shared/service/messages.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss'],
})
export class EditCategoryComponent implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoriesService: CategoriesService,
    private messagesService: MessagesService,
    private fb: FormBuilder
  ) {}
  categoryType = CategoryTypeEnum;
  categoryId!: string;
  parentsCategories!: ICategory[];
  editCategoryForm!: FormGroup;

  ngOnInit(): void {
    this.categoryId = this.activatedRoute.snapshot.params['categoryId'];
    this.categoriesService.getAllCategories(10000, 1, [this.categoryType.Main]).subscribe((res) => {
      this.parentsCategories = res.responseData.items;
    });
    this.initEditCategoryForm(this.categoryId);
    this.handleCategoryTypeChange();
  }

  initEditCategoryForm(categoryId: string) {
    this.editCategoryForm = this.fb.group({
      id: [{ value: null, disabled: true }, []],
      code: [null, Validators.required],
      name_AR: [null, Validators.required],
      name_EN: [null],
      parentCategoryId: [null],
      categoryTypeId: [null],
    });
    // this.editCategoryForm.get('parentCategoryId')?.disable({ emitEvent: false });
    this.getCategoryById(categoryId);
  }

  getCategoryById(categoryId: string) {
    this.categoriesService.getCategoryById(categoryId).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          const category = res.responseData;
          this.editCategoryForm.setValue(category);
        }
      },
    });
  }

  handleCategoryTypeChange() {
    this.editCategoryForm.get('categoryTypeId')?.valueChanges.subscribe((value) => {
      const parentCategoryIdControl = this.editCategoryForm.get('parentCategoryId');
      if (+value === this.categoryType.Main) {
        parentCategoryIdControl?.removeValidators([Validators.required]);
      } else if (+value === this.categoryType.SubMain) {
        parentCategoryIdControl?.setValidators([Validators.required]);
      }
      parentCategoryIdControl?.updateValueAndValidity();
    });
  }

  saveEdit() {
    if (this.editCategoryForm.invalid) {
      this.messagesService.toast('من فضلك اِملأْ الحقول المطلوبة', 'error');
      this.editCategoryForm.markAllAsTouched();
      return;
    }

    const updatedCategory = {
      id: this.editCategoryForm.get('id')?.value,
      code: this.editCategoryForm.get('code')?.value,
      name_AR: this.editCategoryForm.get('name_AR')?.value,
      name_EN: this.editCategoryForm.get('name_EN')?.value,
      parentCategoryId: +this.editCategoryForm.get('parentCategoryId')?.value,
      categoryTypeId: +this.editCategoryForm.get('categoryTypeId')?.value,
    };

    this.categoriesService.editCategory(updatedCategory).subscribe((res) => {
      if (res.isSuccess && res.responseData) {
        this.messagesService.toast('تم الحفظ بنجاح', 'success');
        this.router.navigate([`${appRoutes.categories.base}/${appRoutes.categories.grid}`]);
      } else {
        this.messagesService.toast(res.message, 'error');
      }
    });
  }
}
