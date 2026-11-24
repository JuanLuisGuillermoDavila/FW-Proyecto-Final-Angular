import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

function passwordsIgualesValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsNoCoinciden: true };
}

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  errorMsg = signal('');

  form = this.fb.nonNullable.group(
    {
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: passwordsIgualesValidator }
  );

  get passwordsNoCoinciden(): boolean {
    const confirmControl = this.form.get('confirmPassword');
    return !!(
      this.form.hasError('passwordsNoCoinciden') &&
      confirmControl?.dirty
    );
  }

  onSubmit() {
    this.errorMsg.set('');

    if (this.form.hasError('passwordsNoCoinciden')) {
      this.errorMsg.set('Las contraseñas no coinciden. Verifica ambos campos.');
      return;
    }

    if (this.form.invalid) return;

    const { fullName, email, password } = this.form.getRawValue();
    this.auth.registro({ fullName, email, password }).subscribe({
      next: () => this.router.navigate(['/burritolector/login']),
      error: () => this.errorMsg.set('No se pudo completar el registro. Verifica tus datos.')
    });
  }
}
