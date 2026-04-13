import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

const passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const passwordConfirm = control.get('passwordConfirm')?.value;

  if (!password || !passwordConfirm || password === passwordConfirm) {
    return null;
  }

  return { passwordsMismatch: true };
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected isSubmitting = false;
  protected formError = '';
  protected readonly registerForm = this.fb.nonNullable.group(
    {
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      passwordConfirm: ['', [Validators.required]]
    },
    { validators: passwordsMatchValidator }
  );

  protected submit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.clearServerErrors();
    this.isSubmitting = true;

    const formValue = this.registerForm.getRawValue();

    this.authService.register({
      username: formValue.username,
      email: formValue.email,
      password: formValue.password,
      password_confirm: formValue.passwordConfirm
    }).pipe(
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
    this.clearControlError('username');
    this.clearControlError('email');
    this.clearControlError('password');
    this.clearControlError('passwordConfirm');
  }

  private clearControlError(controlName: 'username' | 'email' | 'password' | 'passwordConfirm'): void {
    const control = this.registerForm.controls[controlName];
    if (!control.errors?.['server']) {
      return;
    }

    const { server, ...otherErrors } = control.errors;
    control.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
  }

  private applyServerErrors(error: HttpErrorResponse): void {
    const payload = error.error ?? {};

    if (payload.username?.length) {
      this.registerForm.controls.username.setErrors({
        ...(this.registerForm.controls.username.errors ?? {}),
        server: payload.username[0]
      });
    }

    if (payload.email?.length) {
      this.registerForm.controls.email.setErrors({
        ...(this.registerForm.controls.email.errors ?? {}),
        server: payload.email[0]
      });
    }

    if (payload.password?.length) {
      this.registerForm.controls.password.setErrors({
        ...(this.registerForm.controls.password.errors ?? {}),
        server: payload.password[0]
      });
    }

    if (payload.password_confirm?.length) {
      this.registerForm.controls.passwordConfirm.setErrors({
        ...(this.registerForm.controls.passwordConfirm.errors ?? {}),
        server: payload.password_confirm[0]
      });
    }

    const nonFieldErrors = payload.non_field_errors ?? [];
    this.formError = nonFieldErrors[0] ?? payload.detail ?? 'Unable to create your account right now.';
  }
}