import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Contact } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  private contactsUrl = 'api/contacts';

  constructor(private httpClient: HttpClient) {}

  public list(): Observable<Contact[]>   {
    return this.httpClient.get<Contact[]>(this.contactsUrl);
  }

}

// https://www.csvjson.com/csv2json

/*

import { SalesModule } from '../../sales.module';

providedIn: SalesModule

*/
