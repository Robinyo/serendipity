import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';

import { DialogService } from 'serendipity-components-lib';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private dialogService: DialogService,
              private zone: NgZone) {}

  handleError(error: any) {

    // Check if it's an error from an HTTP response

    if (!(error instanceof HttpErrorResponse)) {
      error = error.rejection;
    }

    this.zone.run(() =>

      this.dialogService.openAlert({
        title: 'Error',
        message: error?.message || 'Undefined client error',
        closeButton: 'CLOSE'
      })

    );

    console.error('Error from global error handler', error);
  }

}

// https://github.com/PKief/angular-global-error-handling/blob/main/src/app/core/core.module.ts
