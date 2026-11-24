import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { ServerStatus } from '../../../core/services/server-status';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);
  serverStatus = inject(ServerStatus);

  errorMsg = signal('');
  cargando = signal(false);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.errorMsg.set('');
    this.cargando.set(true);

    // Si el servidor estaba dormido al intentar entrar, activamos la alerta
    const timer = setTimeout(() => {
      if (this.cargando()) this.serverStatus.estado.set('despertando');
    }, 2500);

    this.auth.login(this.form.getRawValue()).subscribe({
      next: (res: any) => {
        clearTimeout(timer);
        this.cargando.set(false);
        this.serverStatus.estado.set('oculto');

        const user: any = this.auth.currentUser() ?? res?.user ?? res;
        const rol = String(user?.rol ?? user?.role ?? user?.tipo ?? '').toLowerCase();

        if (rol === 'admin' || rol === 'administrador' || user?.isAdmin === true) {
          this.router.navigate(['/burritoadministrador/dash']);
        } else {
          this.router.navigate(['/burritolector/galeria']);
        }
      },
      error: () => {
        clearTimeout(timer);
        this.cargando.set(false);
        this.errorMsg.set('Correo o clave incorrectos');
      }
    });
  }
}
