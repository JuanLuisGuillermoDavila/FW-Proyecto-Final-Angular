// auth-guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(Auth);
  const router = inject(Router);
  if (auth.isAuthenticated()) return true;

  const isAdmin = route.url.some(s => s.path.includes('admin'));
  router.navigate([isAdmin ? '/burritoadministrador/login' : '/burritolector/login']);
  return false;
};
