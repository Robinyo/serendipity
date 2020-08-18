import { Injectable } from '@angular/core';

import { CollectionService } from '../abstract/collection/collection.service';

import { ElectoralDivision } from '../../models/electoral-division';

@Injectable({
  providedIn: 'root'
})
export class ElectoralDivisionsService extends CollectionService {

  constructor() {

    super();

    this.url = 'http://localhost:' + this.config.serverPort + '/api/electoral-divisions/';
  }

  public findByName(name: string): Promise<ElectoralDivision> {

    const queryParams = '?name=' + name;

    return this.httpClient.get<ElectoralDivision>(this.url + 'search/findByName' + queryParams).toPromise();
  }

}
