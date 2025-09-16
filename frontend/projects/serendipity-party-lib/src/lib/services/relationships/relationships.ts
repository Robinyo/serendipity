import { inject, Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { Observable} from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CollectionService } from '../abstract/collection/collection';

import { RoleAdapter } from '../../adapters/role';

import { ROLES, ROLES_WITHOUT_A_TRAILING_SLASH } from './constants';


@Injectable({
  providedIn: 'root'
})
export class RelationshipsService extends CollectionService {

  private adapter: RoleAdapter = inject(RoleAdapter);

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

    return this.httpClient.get(url + queryParams, this.getHttpOptions()).pipe(

      // tap((response: any) => {
      tap(() => {

        this.logger.info('RelationshipsService: findByPartyId() completed');

        // this.logger.info('response: ' + JSON.stringify(response.body, null, 2) + '\n');
      })

    );

  }

}
