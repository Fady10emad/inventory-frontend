import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAddLookup } from '@app/shared/models/ILookup';
import { MessagesService } from '@app/shared/service/messages.service';
import { ProviderService } from '@app/shared/service/provider.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-add-provider-area',
  templateUrl: './add-provider-area.component.html',
  styleUrls: ['./add-provider-area.component.scss']
})
export class AddProviderAreaComponent implements OnInit {

  areaForm!:FormGroup
	constructor
  (

    public fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private messagesService: MessagesService,
    private providerService: ProviderService,

  )
  {}

  ngOnInit(): void {
    this.initVendorForm()
    this.setInternalcodeValue()
  }
  initVendorForm() {
    this.areaForm = this.fb.group({
      nameAr: [null, [Validators.required]],
      nameEn: [null,],
      internalCode: [null,],
    });
  }
  


addProviderArea() {
    const areaObjSent: IAddLookup = {
      ...this.areaForm.value
    }

    console.log(areaObjSent)
    if (!this.areaForm.valid) {
      this.messagesService.toast('من فضلك اِملأْ الحقول المطلوبة', 'error');
      this.areaForm.markAllAsTouched();
      return;
    }
    
    this.providerService.addProviderArea(areaObjSent).subscribe({
      next: (res) => {
        if(res.isSuccess){
          this.messagesService.toast('تم اضافة منطقة', 'success');
          this.activeModal.close()

            // update data source
            this.providerService.onAddArea.next(true);
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
  const uniqueName = `Area-${currentHours}${currentMinutes}${currentSeconds}${currentMilliseconds}`;
  this.areaForm.get('internalCode')?.setValue(uniqueName)
}


}

