import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Contact } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  private contactsUrl = 'api/contacts/';

  constructor(private httpClient: HttpClient) {}

  public list(): Observable<Contact[]>   {
    return this.httpClient.get<Contact[]>(this.contactsUrl);
  }

  public get(id: string): Observable<Contact>   {
    return this.httpClient.get<Contact>(this.contactsUrl + id);
  }

}

// https://firebase.google.com/docs/firestore/reference/rest/

// https://www.csvjson.com/csv2json

/*

import { SalesModule } from '../../sales.module';

providedIn: SalesModule

*/
