import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">تأكيد</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      {{message}}
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">لا</button>
      <button type="button" class="btn btn-primary" (click)="activeModal.close('yes')">نعم</button>
    </div>
  `
})
export class ConfirmModalComponent {
  @Input() message: string = '';

  constructor(public activeModal: NgbActiveModal) {}
}