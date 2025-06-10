import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IAddLookup } from '@app/shared/models/ILookup';
import { MessagesService } from '@app/shared/service/messages.service';
import { ProviderService } from '@app/shared/service/provider.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-provider-category',
  templateUrl: './add-provider-category.component.html',
  styleUrls: ['./add-provider-category.component.scss']
})
export class AddProviderCategoryComponent implements OnInit {

  categoryForm!:FormGroup
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
    this.categoryForm = this.fb.group({
      nameAr: [null, [Validators.required]],
      nameEn: [null,],
      internalCode: [null,],
    });
  }
  


addProviderCategory() {
    const categoryObjSent: IAddLookup = {
      ...this.categoryForm.value
    }

    console.log(categoryObjSent)
    if (!this.categoryForm.valid) {
      this.messagesService.toast('من فضلك اِملأْ الحقول المطلوبة', 'error');
      this.categoryForm.markAllAsTouched();
      return;
    }
    
    this.providerService.addProviderCategory(categoryObjSent).subscribe({
      next: (res) => {
        if(res.isSuccess){
          this.messagesService.toast('تم اضافة مجموعة', 'success');
          this.activeModal.close()

            // update data source
            this.providerService.onAddCategory.next(true);
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
  const uniqueName = `Cat-${currentHours}${currentMinutes}${currentSeconds}${currentMilliseconds}`;
  this.categoryForm.get('internalCode')?.setValue(uniqueName)
}


}
