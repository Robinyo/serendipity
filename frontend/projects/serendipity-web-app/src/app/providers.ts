import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler} from '@angular/core';

import { GlobalErrorHandler } from '@app/core/error-handlers/global-error-handler';
import { HttpLoadingInterceptor } from '@app/core/http-interceptors/http-loading.interceptor';

export const globalErrorProvider = [

  {
    provide: ErrorHandler,
    useClass: GlobalErrorHandler
  }

];

export const httpInterceptors = [

  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpLoadingInterceptor,
    multi: true,
  }

];
