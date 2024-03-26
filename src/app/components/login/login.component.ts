import { Component } from '@angular/core';
import { Validators, FormsModule, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'ky-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [
    FormsModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, ReactiveFormsModule,
    AsyncPipe,
  ],
})
export class LoginComponent {
  loginForm = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    cgu: [false, [Validators.required, Validators.requiredTrue]],
  });

  sent = false;

  login$: Observable<{success: boolean, code: string}> | null = null

  constructor(private _formBuilder: NonNullableFormBuilder, private authService: AuthService) {}

  onSubmit(): void {
    this.loginForm.disable();

    this.sent = true;

    this.login$ = this.authService.login(this.loginForm.value.email!)
  }
}

export default LoginComponent;