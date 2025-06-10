import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '@core/service/auth.service';
import { MessagesService } from '@app/shared/service/messages.service';
import { localStorageKeys } from '@app/core/enums/localStorageKeys';
import { appRoutes } from '@app/shared/routers/appRouters';
import { LoginCredentials } from '@app/shared/models/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  regesterLink = `${appRoutes.auth.base}/${appRoutes.auth.register}`;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private messagesService: MessagesService
  ) {}
  returnUrl?: string;
  loginForm = this.fb.group({
    email: this.fb.control<string>('', [Validators.required, Validators.email]),
    password: this.fb.control<string>('', [Validators.required]),
  });

  ngOnInit(): void {
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    const credential: LoginCredentials = {
      email: this.loginForm.value.email ?? '',
      password: this.loginForm.value.password ?? '',
    };
    this.authService.login(credential).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          localStorage.setItem(localStorageKeys.JWT, res.responseData.token);
          localStorage.setItem(localStorageKeys.userName, res.responseData.userName);
          this.router.navigate([this.returnUrl]);
        } else {
          this.messagesService.toast(res.message, 'error');
        }
      },
    });
  }
}
