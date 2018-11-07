import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { DynamicFormControlModel } from '../../models/dynamic-form-control.model';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormMetadataService {

  private url = 'assets/data/forms/';

  constructor(private httpClient: HttpClient) {}

  public get(filename: string): Observable<DynamicFormControlModel[]>   {
    return this.httpClient.get<DynamicFormControlModel[]>(this.url + filename);
  }

}
