import { inject, Injectable } from '@angular/core';
import { HttpResponse} from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AbstractCollectionService } from 'serendipity-utils-lib';

import { ContactModel } from '../../models/contact';
import { RoleModel } from '../../models/role';
import { ContactAdapter } from '../../adapters/contact';

import { INDIVIDUALS, INDIVIDUALS_WITHOUT_A_TRAILING_SLASH } from './constants';

@Injectable({
  providedIn: 'root'
})
export class ContactsService extends AbstractCollectionService {

  private adapter: ContactAdapter = inject(ContactAdapter);

  constructor() {

    super();

    this.url = this.getUrlPrefix() + INDIVIDUALS;

    // this.logger.info('Contacts Service: constructor()');
  }

  public find(filter: string, offset: number = 0, limit: number = 100): Observable<any> {

    this.logger.info('Contacts Service: find()');

    let url = this.getUrlPrefix() + INDIVIDUALS_WITHOUT_A_TRAILING_SLASH;
    let queryParams;

    if (filter.length) {

      url = url + '/search/findByFamilyNameStartsWith';
      queryParams = '?name=' + filter + '&page=' + offset + '&size=' + limit + '&sort=name.familyName&name.familyName.dir=asc';

    } else {

      queryParams = '?page=' + offset + '&size=' + limit + '&sort=name.familyName&name.familyName.dir=asc';

    }

    this.logger.info('url: ' + url);
    this.logger.info('queryParams: ' + queryParams);

    return this.httpClient.get(url + queryParams, this.getDefaultHttpGetOptions()).pipe(

      // tap((response: any) => {
      tap(() => {

        this.logger.info('Contacts Service: find() completed');

        // this.logger.info('response: ' + JSON.stringify(response.body, null, 2) + '\n');
      })
    );

  }

  public findById(id: string): Observable<ContactModel> {

    this.logger.info('Contacts Service: findById()');

    this.logger.info('url: ' + this.url + id);

    return this.httpClient.get(this.url + id, this.getDefaultHttpGetOptions()).pipe(

      map((response: any) => this.adapter.adapt(response.body)),

      tap(() => {
        this.logger.info('Contacts Service: findById() completed');
      })
    );

  }

  public create(contact: ContactModel): Observable<HttpResponse<ContactModel>> {

    return this.httpClient.post<HttpResponse<ContactModel>>(this.url, contact, this.getDefaultHttpPostOptions()).pipe(
      tap(() => {
        this.logger.info('Contacts Service: create() completed');
      })
    );

  }

  public update(id: string, contact: ContactModel): Observable<HttpResponse<ContactModel>> {

    return this.httpClient.patch<HttpResponse<ContactModel>>(this.url + id, contact).pipe(
      tap(() => {
        this.logger.info('Contacts Service: update() completed');
      })
    );

  }

  public delete(id: string): Observable<ContactModel> {

    return this.httpClient.delete<ContactModel>(this.url + id).pipe(
      tap(() => {
        this.logger.info('Contacts Service: delete() completed');
      })
    );

  }

  public createRole(id: string, role: RoleModel): Observable<HttpResponse<RoleModel>>  {

    return this.httpClient.post<HttpResponse<RoleModel>>(this.url + id + '/roles', role, this.getDefaultHttpPostOptions()).pipe(
      tap(() => {
        this.logger.info('Contacts Service: createRole() completed');
      })
    );

  }

  public deleteRole(id: string, roleId: string): Observable<ContactModel> {

    return this.httpClient.delete<ContactModel>(this.url + id + '/roles/' + roleId).pipe(
      tap(() => {
        this.logger.info('Contacts Service: deleteRole() completed');
      })
    );

  }

}
