import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

function passwordComplexityValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null; // required отработает отдельно

  const hasMinLength = value.length >= 8;
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[^A-Za-z0-9]/.test(value);

  if (!hasMinLength || !hasNumber || !hasSpecial) {
    return { passwordComplexity: true };
  }
  return null;
}

function passwordsMatchValidator(
  group: AbstractControl
): ValidationErrors | null {
  const password = group.get('password')?.value;
  const repeatPassword = group.get('repeatPassword')?.value;

  if (!password || !repeatPassword) return null;

  return password === repeatPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class SignupComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error: string | null = null;

  form = new FormGroup(
    {
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', [
        Validators.required,
        passwordComplexityValidator, // + сложность
      ]),
      repeatPassword: new FormControl('', [
        Validators.required,
      ]),
    },
    {
      validators: [passwordsMatchValidator],
    }
  );

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get repeatPassword() {
    return this.form.get('repeatPassword');
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const { email, password } = this.form.value;

    try {
      await this.auth.signup(email!, password!);
      this.router.navigate(['/profile']);
    } catch (err: any) {
      this.error = err?.message || 'Signup failed';
    } finally {
      this.loading = false;
    }
  }
}
