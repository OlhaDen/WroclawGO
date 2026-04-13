import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected isSubmitting = false;
  protected formError = '';
  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  protected submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.clearServerErrors();
    this.isSubmitting = true;

    this.authService.login(this.loginForm.getRawValue()).pipe(
      finalize(() => (this.isSubmitting = false))
    ).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/your-avatar';
        this.router.navigateByUrl(returnUrl);
      },
      error: (error: HttpErrorResponse) => this.applyServerErrors(error)
    });
  }

  private clearServerErrors(): void {
    this.formError = '';
    this.clearControlError('email');
    this.clearControlError('password');
  }

  private clearControlError(controlName: 'email' | 'password'): void {
    const control = this.loginForm.controls[controlName];
    if (!control.errors?.['server']) {
      return;
    }

    const { server, ...otherErrors } = control.errors;
    control.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
  }

  private applyServerErrors(error: HttpErrorResponse): void {
    const payload = error.error ?? {};

    if (payload.email?.length) {
      this.loginForm.controls.email.setErrors({
        ...(this.loginForm.controls.email.errors ?? {}),
        server: payload.email[0]
      });
    }

    if (payload.password?.length) {
      this.loginForm.controls.password.setErrors({
        ...(this.loginForm.controls.password.errors ?? {}),
        server: payload.password[0]
      });
    }

    const nonFieldErrors = payload.non_field_errors ?? [];
    this.formError = nonFieldErrors[0] ?? payload.detail ?? 'Unable to sign in right now.';
  }
}