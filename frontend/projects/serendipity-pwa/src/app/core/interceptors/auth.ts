import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // Define your BFF target URL for local development environment fallback
  const bffUrl = 'https://serendipity.localhost';

  // If running locally on 4200, ensure API traffic routes to your Spring Cloud Gateway explicitly
  let clonedReq = req;
  if (window.location.hostname === 'localhost' && window.location.port === '4200' && !req.url.startsWith('http')) {
    clonedReq = req.clone({ url: `${bffUrl}${req.url.startsWith('/') ? '' : '/'}${req.url}` });
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Break out of the dev server context and hit the real BFF login flow
        const targetBff = window.location.hostname === 'localhost' && window.location.port === '4200' ? bffUrl : '';
        window.location.href = `${targetBff}/oauth2/authorization/keycloak`;
      }
      return throwError(() => error);
    })
  );

};
