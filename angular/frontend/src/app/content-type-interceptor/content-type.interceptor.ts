import { HttpInterceptorFn } from '@angular/common/http';

export const contentTypeInterceptor: HttpInterceptorFn = (req, next) => {
  let headers = req.headers;
  let body = req.body;
  if (req.body) {
    headers = headers.set('Content-Type', 'application/json');
    body = JSON.stringify(req.body);
  }
  const clonedReq = req.clone({
    headers: headers,
    withCredentials: true,
    body: body,
  });

  return next(clonedReq);
};
