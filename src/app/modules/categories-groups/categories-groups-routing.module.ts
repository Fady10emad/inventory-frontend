import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { appRoutes } from '@app/shared/routers/appRouters';

import { CategoriesGridComponent } from './categories-group-grid/categories-grid.component';
import { CreateCategoryComponent } from './create-category-group/create-category.component';
import { EditCategoryComponent } from './edit-category-group/edit-category.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: appRoutes.categories.grid,
    pathMatch: 'full',
  },
  {
    path: appRoutes.categories.create,
    component: CreateCategoryComponent,
  },
  {
    path: `${appRoutes.categories.edit}/:categoryId`,
    component: EditCategoryComponent,
  },
  {
    path: appRoutes.categories.grid,
    component: CategoriesGridComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesGroupsRoutingModule {}
