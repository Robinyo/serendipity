import { inject, Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService, LoggerService } from 'serendipity-utils-lib';

const COLUMN_DEFS = 'contacts-column-defs';

@Injectable({
  providedIn: 'root'
})
export class ContactsResolver implements Resolve<any[]> {

  protected configService = inject(ConfigService);
  protected logger = inject(LoggerService);

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    this.logger.info('Contacts Resolver: resolve()');

    return this.configService.get(COLUMN_DEFS).pipe(
      catchError(error => {
        return of('No data');
      })
    );
  }

}
