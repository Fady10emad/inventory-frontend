import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddPriceListRequest } from '@app/shared/models/IPriceList';
import { appRoutes } from '@app/shared/routers/appRouters';
import { MessagesService } from '@app/shared/service/messages.service';
import { PriseListService } from '@app/shared/service/prise-list.service';

@Component({
  selector: 'app-add-price-list',
  templateUrl: './add-price-list.component.html',
  styleUrls: ['./add-price-list.component.scss'],
})
export class AddPriceListComponent {
  addPriceListForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private priceListService: PriseListService,
    private messageServie: MessagesService,
    private router: Router
  ) {
    this.addPriceListForm = this.fb.group({
      code: ['', Validators.required],
      description: ['', Validators.required],
      profitabilityRatio: [0, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.addPriceListForm.valid) {
      const formData: AddPriceListRequest = this.addPriceListForm.value;
      this.priceListService.addPriceList(formData).subscribe((res) => {
        if (res.isSuccess) {
          this.messageServie.toast('تم انشاء قائمة أسعار', 'success');
          //TODO:change Routing
          this.router.navigate([`${appRoutes.priceList.base}/${appRoutes.priceList.grid}`]);
        } else {
          this.messageServie.toast('حدث خطأ ما', 'error');
        }
      });
    }
  }

  acceptNumbersOnly(event: any, formControlName: string) {
    let value = event.target.value.replace(/[^\d.]/g, '');
    const text: any = [];
    for (let char of value) {
      if (!isNaN(parseInt(char, 10)) || char === '.') {
        text.push(char);
      }
    }
    let finalValue = text.join('');
    this.addPriceListForm.get(formControlName)?.setValue(+finalValue);
    console.log(this.addPriceListForm.get(formControlName)?.value);
  }
}
