import { HttpInterceptorFn } from '@angular/common/http';

const tokenKey = 'mi-primera-api-token';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem(tokenKey);

  if (!token || !request.url.startsWith('http://localhost:5283/api/') || request.url.endsWith('/Auth/login')) {
    return next(request);
  }

  return next(request.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  }));
};
