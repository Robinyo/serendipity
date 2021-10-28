import { Injectable } from '@angular/core';
import { HttpHandler, HttpRequest, HttpEvent, HttpInterceptor } from '@angular/common/http';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { DialogService, LoadingDialogComponent } from 'serendipity-components-lib';

@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {

  constructor(private dialogService: DialogService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    this.dialogService.openDialog(LoadingDialogComponent);

    return next.handle(request).pipe(
      finalize(() => {
        this.dialogService.closeDialog();
      })
    ) as Observable<HttpEvent<any>>;
  }

}
