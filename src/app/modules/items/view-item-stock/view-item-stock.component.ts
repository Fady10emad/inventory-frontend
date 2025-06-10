import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsService } from '@app/shared/service/items.service';
import { MessagesService } from '@app/shared/service/messages.service';

interface IStorageFormControls {
  storageId: FormControl<number | null>;
  lastAddDate: FormControl<number | null>;
  lastExchangeDate: FormControl<number | null>;
  LastSupplierTransaction: FormControl<number | null>;
  lastPurchasePrice: FormControl<number | null>;
  currentAverageCost: FormControl<number | null>;
  averageCostOftheBeginningterm: FormControl<number | null>;
}
@Component({
  selector: 'app-view-item-stock',
  templateUrl: './view-item-stock.component.html',
  styleUrls: ['./view-item-stock.component.scss'],
})
export class ViewItemStockComponent implements OnInit {
  id: any;

  constructor(
    private fb: FormBuilder,
    private messageServie: MessagesService,
    private itemsService: ItemsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  storageForm!: FormGroup<IStorageFormControls>;
  storages = [
    { id: 1, name: 'مخزن أ' },
    { id: 2, name: 'مخزن ب' },
  ];

  stock = {
    openinngStock: {
      piece: 34,
      package: 20,
    },
    currentStock: {
      piece: 40,
      package: 20,
    },
    reservedQuntitiy: {
      piece: 10,
      package: 20,
    },
    minimum: {
      piece: 31,
      package: 23,
    },
    maximum: {
      piece: 30,
      package: 20,
    },
  };

  ngOnInit(): void {
    this.initStorageForm();
    this.handleStorageChange();
    this.id = this.activatedRoute.snapshot.params['itemId'];
    this.getItemCostById();
  }

  initStorageForm() {
    this.storageForm = this.fb.group({
      storageId: this.fb.control(0),
      lastAddDate: this.fb.control(0),
      lastExchangeDate: this.fb.control(0),
      LastSupplierTransaction: this.fb.control(0),
      lastPurchasePrice: this.fb.control(0),
      currentAverageCost: this.fb.control(0),
      averageCostOftheBeginningterm: this.fb.control(0),
    });
  }

  handleStorageChange() {
    const storageIdControl = this.storageForm.controls.storageId;
    storageIdControl.valueChanges.subscribe((storageId) => {
      this.stock = {
        openinngStock: {
          piece: 23 * (storageId ?? 0),
          package: 20,
        },
        currentStock: {
          piece: 40,
          package: 20 * (storageId ?? 0),
        },
        reservedQuntitiy: {
          piece: 10 * (storageId ?? 0),
          package: 0,
        },
        minimum: {
          piece: 31 * (storageId ?? 0),
          package: 0,
        },
        maximum: {
          piece: 30,
          package: 0,
        },
      };
    });
  }

  getItemCostById() {
    this.itemsService.getItemCostById(this.id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.storageForm.patchValue(res.responseData);
        }
      },
    });
  }
}
