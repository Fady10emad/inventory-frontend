import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/core/service/auth.service';
import { MessagesService } from '@app/shared/service/messages.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private messagesService: MessagesService
  ) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  returnUrl?: string;
  loginForm = this.fb.group({
    code: this.fb.control('', [Validators.required]),
    description: this.fb.control('', [Validators.required]),
    location: this.fb.control('', [Validators.required]),
    responsible: this.fb.control('', [Validators.required]),
    phone: this.fb.control('', [Validators.required]),
  });

  regester() {}
}
