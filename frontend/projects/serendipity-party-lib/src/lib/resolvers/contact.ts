import { inject, Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Observable, forkJoin } from 'rxjs';

import { DynamicFormService } from 'serendipity-dynamic-forms-lib';
import { ConfigService, LoggerService } from 'serendipity-utils-lib';

import { RELATIONSHIP_LIST_COLUMN_DEFS } from './constants';
import { CONTACT_ADDRESS_INFORMATION_GROUP, CONTACT_GENERAL_INFORMATION_GROUP } from './form-ids';

@Injectable({
  providedIn: 'root'
})
export class ContactResolver implements Resolve<any> {

  protected configService = inject(ConfigService);
  protected dynamicFormService: DynamicFormService = inject(DynamicFormService);
  protected logger = inject(LoggerService);

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    this.logger.info('Contact Resolver: resolve()');

    const relationshipListColumnDefs= this.configService.get(RELATIONSHIP_LIST_COLUMN_DEFS);

    const generalInformationFormDefs = this.dynamicFormService.getFormMetadata(CONTACT_GENERAL_INFORMATION_GROUP);
    const addressInformationFormDefs = this.dynamicFormService.getFormMetadata(CONTACT_ADDRESS_INFORMATION_GROUP);

    return forkJoin({
      relationshipListColumDefs: relationshipListColumnDefs,
      generalInformationFormDefs: generalInformationFormDefs,
      addressInformationFormDefs: addressInformationFormDefs
    });
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
