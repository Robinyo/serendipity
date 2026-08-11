import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Observable, forkJoin } from 'rxjs';

import { ConfigService, FormsService, LoggerService } from 'serendipity-utils-lib';

import { RELATIONSHIP_LIST_COLUMN_DEFS } from './constants';
import { CONTACT_INFORMATION_FORM } from './form-ids';

@Injectable({
  providedIn: 'root'
})
export class ContactResolver implements Resolve<any> {

  protected configService = inject(ConfigService);
  protected dynamicFormService: FormsService = inject(FormsService);
  protected logger = inject(LoggerService);

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    this.logger.info('Contact Resolver: resolve()');

    const relationshipListColumnDefs= this.configService.get(RELATIONSHIP_LIST_COLUMN_DEFS);

    //  @if (viewMode === 'card')
    const generalInformationFormDefs = this.dynamicFormService.getFormMetadata(CONTACT_INFORMATION_FORM);

    // const generalInformationFormDefs = this.dynamicFormService.getFormMetadata(CONTACT_SUMMARY_TAB_FORM);
    // const addressInformationFormDefs = this.dynamicFormService.getFormMetadata(CONTACT_ADDRESS_INFORMATION_GROUP);

    return forkJoin({
      relationshipListColumDefs: relationshipListColumnDefs,
      generalInformationFormDefs: generalInformationFormDefs
      // addressInformationFormDefs: addressInformationFormDefs
    });
  }

}
