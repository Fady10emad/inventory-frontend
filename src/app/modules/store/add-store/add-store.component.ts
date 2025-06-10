import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { appRoutes } from '@app/shared/routers/appRouters';
import { MessagesService } from '@app/shared/service/messages.service';
import { StoreService } from '@app/shared/service/store.service';

export interface AddStoreRequest {
  code: string;
  description: string;
  location: string;
  responsible: string;
  phone: string;
}

@Component({
  selector: 'app-add-store',
  templateUrl: './add-store.component.html',
  styleUrls: ['./add-store.component.scss'],
})
export class AddStoreComponent {
  addStoreForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private router: Router,
    private messageServie: MessagesService
  ) {}

  ngOnInit(): void {
    this.addStoreForm = this.fb.group({
      code: this.fb.control('', Validators.required),
      description: this.fb.control('', Validators.required),
      location: this.fb.control('', Validators.required),
      responsible: this.fb.control('', Validators.required),
      phone: this.fb.control('', Validators.required),
    });
  }

  onSubmit(): void {
    const newStore = {
      ...this.addStoreForm.value,
    };

    if (!this.addStoreForm.valid) {
      this.messageServie.toast('من فضلك اِملأْ الحقول المطلوبة', 'error');
      this.addStoreForm.markAllAsTouched();
      return;
    }

    this.storeService.addStore(newStore).subscribe((res) => {
      if (res.isSuccess) {
        this.messageServie.toast('تم انشاء مخزن', 'success');
        this.router.navigate([appRoutes.store.base, appRoutes.store.grid]);
      } else {
        this.messageServie.toast('حدث خطأ ما', 'error');
      }
    });
  }
}
