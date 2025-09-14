import { inject, Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Observable, forkJoin } from 'rxjs';

import { DynamicFormService } from 'serendipity-dynamic-forms-lib';
import { LoggerService } from 'serendipity-utils-lib';

import { CONTACT_ADDRESS_INFORMATION_GROUP, CONTACT_GENERAL_INFORMATION_GROUP } from './form-ids';

const COLUMN_DEFS = 'contacts-column-defs';

@Injectable({
  providedIn: 'root'
})
export class ContactResolver implements Resolve<any> {

  protected dynamicFormService: DynamicFormService = inject(DynamicFormService);
  protected logger = inject(LoggerService);

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    this.logger.info('Contact Resolver: resolve()');

    const generalInformation = this.dynamicFormService.getFormMetadata(CONTACT_GENERAL_INFORMATION_GROUP);
    const addressInformation = this.dynamicFormService.getFormMetadata(CONTACT_ADDRESS_INFORMATION_GROUP);

    return forkJoin({ generalInformation: generalInformation, addressInformation: addressInformation});
  }

}

/*

    this.logger.info('Contact Resolver: resolve()');

    return this.dynamicFormService.getFormMetadata(CONTACT_GENERAL_INFORMATION_GROUP).pipe(
      catchError(error => {
        return of('No data');
      })
    );


*/
