import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IAddLookup } from '@app/shared/models/ILookup';
import { MessagesService } from '@app/shared/service/messages.service';
import { ProviderService } from '@app/shared/service/provider.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-provider-currency',
  templateUrl: './add-provider-currency.component.html',
  styleUrls: ['./add-provider-currency.component.scss']
})
export class AddProviderCurrencyComponent {

  currencyForm!:FormGroup
	constructor
  (

    public fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private messagesService: MessagesService,
    private providerService: ProviderService,

  )
  {}

  ngOnInit(): void {
    this.initCategoryForm()
    this.setInternalcodeValue()
  }
  initCategoryForm() {
    this.currencyForm = this.fb.group({
      nameAr: [null, [Validators.required]],
      nameEn: [null,],
      internalCode: [null,],
    });
  }
  


addProviderCurrency() {
    const currencyObjSent: IAddLookup = {
      ...this.currencyForm.value
    }

    console.log(currencyObjSent)
    if (!this.currencyForm.valid) {
      this.messagesService.toast('من فضلك اِملأْ الحقول المطلوبة', 'error');
      this.currencyForm.markAllAsTouched();
      return;
    }
    
    this.providerService.addProviderCurrency(currencyObjSent).subscribe({
      next: (res) => {
        if(res.isSuccess){
          this.messagesService.toast('تم اضافة عملة', 'success');
          this.activeModal.close()

            // update data source
            this.providerService.onAddCurrrency.next(true);
          } else {
            this.messagesService.toast('حدث خطأ ما', 'error');
          }
      }, error: (err) => {
        // this.messageService.popup("", err.message, "error");
      }
    })
  }

  cancle() {
  this.activeModal.dismiss('Close click');
}
setInternalcodeValue(){
  let now = new Date();
  let currentHours = now.getHours().toString().padStart(2, '0');
  let currentMinutes = now.getMinutes().toString().padStart(2, '0');
  let currentSeconds = now.getSeconds().toString().padStart(2, '0');
  let currentMilliseconds = now.getMilliseconds();
  const uniqueName = `Cur-${currentHours}${currentMinutes}${currentSeconds}${currentMilliseconds}`;
  this.currencyForm.get('internalCode')?.setValue(uniqueName)
}
}
