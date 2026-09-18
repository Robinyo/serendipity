import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private httpClient = inject(HttpClient);

  private uriPrefix = 'assets/data/config/';
  private uriSuffix = '.json';

  public get<T>(filename: string): Observable<T> {
    return this.httpClient.get<T>(this.uriPrefix + filename + this.uriSuffix);
  }

}
