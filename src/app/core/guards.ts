
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  return !!localStorage.getItem('companion-token') || router.createUrlTree(['/login']);
};

export const roleGuard = (roles: string[]): CanActivateFn => () => {
  const router = inject(Router);
  const role = localStorage.getItem('companion-role');
  return role && roles.includes(role) ? true : router.createUrlTree(['/login']);
};
