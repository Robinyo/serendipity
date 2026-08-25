import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { forkJoin } from 'rxjs';

import { ConfigService, FormsService, LoggerService } from 'serendipity-utils-lib';

import { RELATIONSHIP_LIST_COLUMN_DEFS } from './constants.js';
import { CONTACT_INFORMATION_FORM } from './form-ids.js';

export const contactResolver: ResolveFn<any> = (route, state) => {

  const configService: ConfigService = inject(ConfigService);
  const dynamicFormService: FormsService = inject(FormsService);
  const logger:LoggerService = inject(LoggerService);

  logger.info('Contact Resolver');

  const relationshipListColumnDefs= configService.get(RELATIONSHIP_LIST_COLUMN_DEFS);

  //  @if (viewMode === 'card')
  const generalInformationFormDefs = dynamicFormService.getFormMetadata(CONTACT_INFORMATION_FORM);

  return forkJoin({
    relationshipListColumDefs: relationshipListColumnDefs,
    generalInformationFormDefs: generalInformationFormDefs
  });

};









/*

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
    // const addressInformationFormDefs = this.dynamicFormService.getFormMetadata(CONTACT_ADDRESS_INFORMATION_GROUP);

    return forkJoin({
      relationshipListColumDefs: relationshipListColumnDefs,
      generalInformationFormDefs: generalInformationFormDefs
      // addressInformationFormDefs: addressInformationFormDefs
    });
  }

}


*/
