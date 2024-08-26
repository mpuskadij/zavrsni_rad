import { CanActivateFn } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  if (
    sessionStorage.getItem('isAdmin') === 'true' ||
    sessionStorage.getItem('isAdmin') === 'false'
  ) {
    return true;
  }
  return false;
};
