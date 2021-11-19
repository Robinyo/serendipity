import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable} from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CollectionService } from '../abstract/collection/collection.service';

import { Role } from '../../models/role';
import { RoleAdapter } from '../../adapters/role.adapter';

@Injectable({
  providedIn: 'root'
})
export class RelationshipsService extends CollectionService {

  constructor(private adapter: RoleAdapter) {

    super();

    this.url = this.getUrlPrefix() + '/api/roles/';
  }

  public findByPartyId(partyId: string, offset: number = 0, limit: number = 100): Observable<any> {

    this.logger.info('RelationshipsService: findByPartyId()');

    const url = this.getUrlPrefix() + '/api/roles/search/findByPartyId';
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
