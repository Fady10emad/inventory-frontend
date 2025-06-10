import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ItemsService } from '@app/shared/service/items.service';

export interface ItemPriceFormArray {
  code: FormControl<string | null>;
  description: FormControl<string | null>;
  profitRate: FormControl<number | null>;
  price: FormControl<number | null>;
}

interface IItemForm {
  itemPrices: FormArray<FormGroup<ItemPriceFormArray>>;
  itemId: FormControl<number | null>;
}

@Component({
  selector: 'app-add-item-prices',
  templateUrl: './add-item-prices.component.html',
  styleUrls: ['./add-item-prices.component.scss'],
})
export class AddItemPricesComponent {
  constructor(
    private itemsService: ItemsService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {}
  itemForm!: FormGroup<IItemForm>;
  itemId!: string;
  ngOnInit(): void {
    this.itemId = this.activatedRoute.snapshot.params['itemId'];
    this.itemForm = this.fb.group({
      itemId: this.fb.control(+this.itemId, []),
      itemPrices: this.fb.array([this.createItemPrice()]),
    });
  }

  createItemPrice() {
    return this.fb.group<ItemPriceFormArray>({
      code: this.fb.control('', Validators.required),
      description: this.fb.control('', Validators.required),
      profitRate: this.fb.control(0, Validators.required),
      price: this.fb.control(0, Validators.required),
    });
  }

  get f() {
    return this.itemForm.controls;
  }

  get itemPricesFormArray() {
    return this.f.itemPrices;
  }

  addItemPrice(): void {
    this.f.itemPrices.push(this.createItemPrice());
  }

  removeItemPrice(index: number): void {
    this.f.itemPrices.removeAt(index);
  }

  addNewPricesToItem() {
    this.itemsService.addItemPrices(this.itemForm.value).subscribe({
      next: (res) => {
        if (res.isSuccess) {
        }
      },
    });
  }
}
