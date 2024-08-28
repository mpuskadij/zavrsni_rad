import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, catchError, of, throwError } from 'rxjs';

export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    catchError((response: any) => {
      if (response instanceof HttpErrorResponse) {
        if (response.status == HttpStatusCode.Unauthorized) {
          router.navigate(['/login']);
          return EMPTY;
        }
      }

      return EMPTY;
    })
  );
};
