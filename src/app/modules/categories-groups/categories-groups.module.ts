import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesGroupsRoutingModule } from './categories-groups-routing.module';

//Third Modules
import { SharedModule } from '@app/shared/shared.module';
import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';

//Components
import { CreateCategoryComponent } from './create-category-group/create-category.component';
import { CategoriesGridComponent } from './categories-group-grid/categories-grid.component';
import { EditCategoryComponent } from './edit-category-group/edit-category.component';

@NgModule({
  declarations: [CreateCategoryComponent, CategoriesGridComponent, EditCategoryComponent],
  imports: [CommonModule, CategoriesGroupsRoutingModule, SharedModule, TreeGridModule],
  providers: [],
})
export class CategoriesGroupsModule {}
