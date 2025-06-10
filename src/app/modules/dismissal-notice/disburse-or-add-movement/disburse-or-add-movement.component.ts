import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ITransaction } from '@app/modules/items/models/IAddDismissalNotice';
import { MovementEnum } from '@app/shared/enums/Item';
import { appRoutes } from '@app/shared/routers/appRouters';
import { DismissalNoticeService } from '@app/shared/service/dismissal-notice.service';
import { MessagesService } from '@app/shared/service/messages.service';

@Component({
  selector: 'app-disburse-or-add-movement',
  templateUrl: './disburse-or-add-movement.component.html',
  styleUrls: ['./disburse-or-add-movement.component.scss'],
})
export class DisburseOrAddMovementComponent implements OnInit {
  movementType=MovementEnum
  disburseOrAddMovement!:FormGroup
  disburseOrAddMovementId!:any;
  disburseOrAddMovementInfo!:any;
  isEdit:boolean = false
  gridLink:string=`${appRoutes.dismissalNotice.base}/${appRoutes.dismissalNotice.disburseOrAddBase}/${appRoutes.dismissalNotice.disburseOrAddGrid}`

  constructor(
    private dismissalNoticeService: DismissalNoticeService,
    private fb: FormBuilder,
    private messageService: MessagesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.initMovementForm();
    this.isEditRoute();
  }

  initMovementForm() {
    this.disburseOrAddMovement = this.fb.group({
      code: this.fb.control(null, [Validators.required]),
      transactionType: this.fb.control(null, [Validators.required]),
      debitAccount: this.fb.control(null, [Validators.required]),
      creditAccount: this.fb.control(null, [Validators.required]),
      costCenter: this.fb.control(null, [Validators.required]),
      description: this.fb.control(null, [Validators.required]),  
      isPosted: this.fb.control(null, [Validators.required]),  
    });
  }

  isEditRoute(): void {
    const currentRoute = this.activatedRoute.snapshot.url.map((segment) => segment.path);

    this.isEdit = currentRoute.includes('edit') ? true : false;
    if (this.isEdit) {
      this.disburseOrAddMovementId = this.activatedRoute.snapshot.params['id'];
      this.getTransactionById(this.disburseOrAddMovementId);
    }
  }
  getTransactionById(id: any) {
    this.dismissalNoticeService.getTransactionById(id).subscribe((res) => {
      this.disburseOrAddMovementInfo = res.responseData;
      this.disburseOrAddMovement.patchValue(this.disburseOrAddMovementInfo);
    });
  }

  onSubmit(): void {
    const newprovider: ITransaction = {
      ...this.disburseOrAddMovement.value,
    };

    if (!this.disburseOrAddMovement.valid) {
      this.messageService.toast('من فضلك اِملأْ الحقول المطلوبة', 'error');
      this.disburseOrAddMovement.markAllAsTouched();
      return;
    }

    this.dismissalNoticeService.addNewTranaction(newprovider).subscribe((res) => {
      if (res.isSuccess) {
        this.messageService.toast('تم اضافة حركة بنجاح', 'success');
        this.disburseOrAddMovement.reset();
        this.router.navigate([
          `${appRoutes.dismissalNotice.base}/${appRoutes.dismissalNotice.disburseOrAddBase}/${appRoutes.dismissalNotice.disburseOrAddGrid}`,
        ]);
      } else {
        this.messageService.toast('حدث خطأ ما', 'error');
      }
    });
  }

  saveEdit() {
    if (this.disburseOrAddMovement.invalid) {
      this.messageService.toast('من فضلك اِملأْ الحقول المطلوبة', 'error');
      this.disburseOrAddMovement.markAllAsTouched();
      return;
    }

    const updatedProvider: ITransaction = {
      ...this.disburseOrAddMovement.value,
      id: +this.disburseOrAddMovementId,
    };

    this.dismissalNoticeService.editTranaction(updatedProvider).subscribe((res) => {
      if (res.isSuccess && res.responseData) {
        this.messageService.toast('تم الحفظ بنجاح', 'success');
        this.router.navigate([`${appRoutes.dismissalNotice.base}/${appRoutes.dismissalNotice.disburseOrAddBase}/${appRoutes.dismissalNotice.disburseOrAddGrid}`]);
      } else {
        this.messageService.toast(res.message, 'error');
      }
    });
  }
}
