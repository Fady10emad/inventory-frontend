import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor() {}
  confirm(
    btnTitle: string = 'Sure!',
    message: string = 'Message',
    btn: string = 'primary',
    icon: SweetAlertIcon = 'question'
  ) {
    return Swal.fire({
      title: 'Are you sure?',
      text: `You want to ${message}!`,
      icon,
      showCancelButton: true,
      customClass: {
        confirmButton: `btn btn-${btn} btn-sm`,
        cancelButton: 'btn btn-danger btn-sm',
      },
      confirmButtonText: `${btnTitle}`,
      buttonsStyling: false,
      showCloseButton: true,
    });
  }

  templateComfirmation(
    title: string = '',
    msg: string = '',
    btnTitle: string = '',
    cacnelbtn: string = '',
    icon: SweetAlertIcon = 'warning'
  ) {
    const swal = Swal.mixin({
      customClass: {
        confirmButton: `btn btn-success btn-sm mx-2`,
        cancelButton: 'btn btn-danger btn-sm mx-2',
      },
      buttonsStyling: false,
    });
    return swal.fire({
      title,
      html: msg,
      icon,
      showCancelButton: true,
      confirmButtonText: btnTitle,
      cancelButtonText: cacnelbtn,
    });
  }

  popup(title: string, message: string, icon: SweetAlertIcon = 'info') {
    return Swal.fire({
      title,
      text: message,
      icon,
      background: '#fff',
      buttonsStyling: false,
      customClass: {
        confirmButton: `btn btn-success btn-sm`,
      },
    });
  }

  toast(message: string, icon: SweetAlertIcon = 'info') {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-left',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#fff',
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon,
      title: message,
    });
  }

  timerPopup(title: string, body: string, icon: SweetAlertIcon = 'warning') {
    return Swal.fire({
      title,
      html: body,
      timer: 3000,
      background: 'var(--vz-modal-bg)',
      timerProgressBar: true,
      icon,
      allowOutsideClick: false,
      buttonsStyling: false,
      customClass: {
        confirmButton: `btn btn-primary btn-sm`,
      },
    });
  }
}
