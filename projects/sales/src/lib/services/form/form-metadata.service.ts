import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormMetadataService {

  private url = 'assets/data/';

  constructor(private httpClient: HttpClient) {}

  public get(filename: string): Observable<object[]>   {
    return this.httpClient.get<object[]>(this.url + filename);
  }

}
