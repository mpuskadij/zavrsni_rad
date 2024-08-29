import { CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const isAdmin = sessionStorage.getItem('isAdmin');
  if (isAdmin != 'true') {
    return false;
  }

  return true;
};
