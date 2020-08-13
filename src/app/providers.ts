import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { ErrorHandler} from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { HttpErrorInterceptor } from '@app/core/http-interceptors/error-interceptor';
// import { GlobalErrorHandler } from '@app/error-handler';

import { environment } from '@env/environment';

export const angularMaterialProviders = [

  {
    provide: MAT_DATE_LOCALE,
    useValue: environment.defaultLanguage
  }

];

export const errorProviders = [

  /*

    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },

  */

  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true
  }

];


