import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // 1. Ensure any relative path starts with a clean forward slash for proxy matching
  let url = req.url;
  if (!url.startsWith('http') && !url.startsWith('/')) {
    url = `/${url}`;
  }

  // 2. Clone the request with the formatted URL path mapping
  let clonedReq = req.clone({ url });

  // 3. If it's a real business API call, add standard AJAX tracking headers for Spring Security
  if (url.startsWith('/api/') || url.startsWith('/v2/')) {
    clonedReq = clonedReq.clone({
      headers: clonedReq.headers.set('X-Requested-With', 'XMLHttpRequest')
    });
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 4. Only trigger the Keycloak window breakout if an actual API call drops a 401
      // (Bypasses asset files, 500 internal errors, or missing configurations)
      if (error.status === 401 && (url.startsWith('/api/') || url.startsWith('/v2/'))) {
        const bffUrl = 'https://serendipity.localhost';
        const targetBff = window.location.hostname === 'localhost' && window.location.port === '4200' ? bffUrl : '';
        window.location.href = `${targetBff}/oauth2/authorization/keycloak`;
      }
      return throwError(() => error);
    })
  );

};
