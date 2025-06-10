import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ToggleDropdownDirective } from './directives/toggle-dropdown.directive';
import { CustomPaginationComponent } from './components/custom-pagination/custom-pagination.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, FormsModule],
  declarations: [ToggleDropdownDirective, CustomPaginationComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ToggleDropdownDirective,
    CustomPaginationComponent,
    NgSelectModule,
  ],
})
export class SharedModule {}
