import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export class HttpErrorInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request)

    .pipe(

      retry(1),

      catchError((error: HttpErrorResponse) => {

        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {

          // client-side error

          errorMessage = `Error: ${error.error.message}`;

        } else {

          // server-side error

          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

        }

        window.alert(errorMessage);

        return throwError(errorMessage);

      })

    );

  }

}

/*

export class HttpErrorInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(

      catchError((error: HttpErrorResponse) => {

        if (error.error instanceof ErrorEvent) {

          // A client-side (or network) error occurred
          return throwError(error.error);

        } else {

          // The backend returned an unsuccessful response code
          return throwError(error.error.error);
        }

      })

    );

  }

}

// https://rollbar.com/blog/error-handling-with-angular-8-tips-and-best-practices/






*/

/*

// import { retry, catchError } from 'rxjs/operators';

export class HttpErrorInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(

      // retry(1),
      catchError((error: HttpErrorResponse) => {

        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {

          // A client-side (or network) error occurred
          errorMessage = `Error: ${error.error.message}`;

        } else {

          // The backend returned an unsuccessful response code.

          // "error": {
          //   "code": 400,
          //   "message": "Invalid argument",
          //   "status": "INVALID_ARGUMENT"
          // }

          errorMessage = 'HTTP Status Code: ' + error.error.error.code + '\n' + 'Message: ' + error.error.error.message;
        }

        // window.alert(errorMessage);

        // return an observable with a user-facing error message
        return throwError(errorMessage);

      })

    );

  }

}

*/
