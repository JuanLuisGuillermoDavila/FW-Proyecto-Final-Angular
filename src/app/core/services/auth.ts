import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LoginResponse, Usuario } from '../models/models';

@Injectable({ providedIn: 'root' })
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'https://proyecto-final-el-burrito-lector.onrender.com/api/v1/libros/auth';

  currentUser = signal<Usuario | null>(this.getUserFromStorage());
  isAuthenticated = computed(() => !!this.currentUser());

  login(credentials: { email: string; password: string }) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.usuario));
        this.currentUser.set(res.usuario);
      })
    );
  }

  registro(datos: { fullName: string; email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/register`, datos);
  }

  logout(esAdmin = false) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate([esAdmin ? '/burritoadministrador/login' : '/burritolector/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getUserFromStorage(): Usuario | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
