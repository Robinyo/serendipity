import { inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AbstractCollectionService, PagedResponse } from 'serendipity-utils-lib';

import { ContactAdapter } from '../../adapters/contact';
import {ContactModel, ContactSummaryModel} from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class ContactsService extends AbstractCollectionService {

  private readonly individualsApi = '/api/party-service/individuals';
  // private readonly contactsApi = '/api/party-service/contacts';

  // Declare properties without inline injection to stabilise cross-lib evaluation
  private adapter!: ContactAdapter;

  constructor() {

    super();

    this.logger.info('Contacts Service: constructor()')

    // Safely resolve your library-specific adapters inside the execution window
    this.adapter = inject(ContactAdapter);

  }

  public find(filter: string, page: number, size: number):
    Observable<PagedResponse<ContactSummaryModel, 'individuals'>> {

    this.logger.info(`Contacts Service: find(filter: "${filter}", page: ${page}, size: ${size})`);

    // Determine the correct backend endpoint based on whether a filter is present
    // If no filter is set (empty string), hit the master collection.
    // If a filter is present (e.g. 'A'), route it to your custom search endpoint query mapping.

    const url = filter
      ? `${this.individualsApi}/search/findByFamilyNameStartsWith`
      : this.individualsApi;

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'name.familyName,asc');

    if (filter) {
      params = params.set('name', filter);
    }

    const options = {
      params: params
    };

    return this.http.get<PagedResponse<ContactSummaryModel, 'individuals'>>(url, options).pipe(
      tap(() => this.logger.info('Contacts Service: find() completed'))
    );

  }

  public findById(id: string): Observable<ContactModel> {

    this.logger.info('Contacts Service: findContactById()');

    return this.http.get<ContactModel>(`${this.individualsApi}/${id}`, this.getDefaultHttpOptions()).pipe(

      map((response: any) => this.adapter.adapt(response)),

      tap(() => {
        this.logger.info('Contacts Service: findById() completed');
      })
    );

  }

}
