import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService, LoggerService } from 'serendipity-utils-lib';

import { ACCOUNTS_COLUMN_DEFS } from './constants';

@Injectable({
  providedIn: 'root'
})
export class AccountsResolver implements Resolve<any[]> {

  protected configService = inject(ConfigService);
  protected logger = inject(LoggerService);

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    this.logger.info('Accounts Resolver: resolve()');

    return this.configService.get(ACCOUNTS_COLUMN_DEFS).pipe(
      catchError(error => {
        return of('No data');
      })
    );
  }

}
