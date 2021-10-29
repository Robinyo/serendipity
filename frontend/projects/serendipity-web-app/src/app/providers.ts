import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler} from '@angular/core';

import { GlobalErrorHandler } from '@app/core/error-handlers/global-error-handler';

export const globalErrorProvider = [

  {
    provide: ErrorHandler,
    useClass: GlobalErrorHandler
  }

];
