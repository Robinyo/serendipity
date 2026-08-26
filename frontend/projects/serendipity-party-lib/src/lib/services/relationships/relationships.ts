import { Injectable } from '@angular/core';

import { Observable} from 'rxjs';
import { tap } from 'rxjs/operators';

import { AbstractCollectionService } from 'serendipity-utils-lib';

import { ROLES, ROLES_WITHOUT_A_TRAILING_SLASH } from './constants';

@Injectable({
  providedIn: 'root'
})
export class RelationshipsService extends AbstractCollectionService {

  // private adapter: RoleAdapter = inject(RoleAdapter);

  constructor() {

    super();

    this.url = this.getUrlPrefix() + ROLES;

    // this.logger.info('Relationships Service: constructor()');
  }

  public findByPartyId(partyId: string, offset: number = 0, limit: number = 100): Observable<any> {

    this.logger.info('Relationships Service: findByPartyId()');

    const url = this.getUrlPrefix() + ROLES_WITHOUT_A_TRAILING_SLASH + '/search/findByPartyId';
    const queryParams = '?partyId=' + partyId + '&page=' + offset + '&size=' + limit + '&sort=name&name.dir=asc';

    this.logger.info('url: ' + url);
    this.logger.info('queryParams: ' + queryParams);

    return this.httpClient.get(url + queryParams, this.getDefaultHttpGetOptions()).pipe(

      // tap((response: any) => {
      tap(() => {

        this.logger.info('Relationships Service: findByPartyId() completed');

        // this.logger.info('response: ' + JSON.stringify(response.body, null, 2) + '\n');
      })

    );

  }

}
