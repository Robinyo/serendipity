import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  protected httpClient = inject(HttpClient);
  protected logger: LoggerService = inject(LoggerService);

  private uriPrefix = 'assets/data/forms/';
  private uriSuffix = '.json';

  public getFormMetadata(formId: string): Observable<any> {
    return this.httpClient.get<any>(this.uriPrefix + formId + this.uriSuffix);
  }

}

/*

  private getProperty = (obj: any, path: any) => (
    path.split('.').reduce((o: any, p: any) => o && o[p], obj)
  )

*/
