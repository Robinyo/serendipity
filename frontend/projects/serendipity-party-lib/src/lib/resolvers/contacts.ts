import { inject, Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService, LoggerService } from 'serendipity-utils-lib';

import { CONTACTS_COLUMN_DEFS } from './column-defs';

@Injectable({
  providedIn: 'root'
})
export class ContactsResolver implements Resolve<any[]> {

  protected configService = inject(ConfigService);
  protected logger = inject(LoggerService);

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    this.logger.info('Contacts Resolver: resolve()');

    return this.configService.get(CONTACTS_COLUMN_DEFS).pipe(
      catchError(error => {
        return of('No data');
      })
    );
  }

}
