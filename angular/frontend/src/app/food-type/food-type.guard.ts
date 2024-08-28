import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const foodTypeGuard: CanActivateFn = (route, state) => {
  const type = route.paramMap.get('type');
  const id = route.paramMap.get('id');
  if (type && id) {
    if (type == 'common' || type == 'branded') return true;
  }
  const router = inject(Router);
  router.navigate(['/nutrition']);
  return false;
};
