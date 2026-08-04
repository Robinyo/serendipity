import { Injectable } from '@angular/core';
// import { HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// import { HttpOptions } from 'serendipity-utils-lib';

import { CollectionService } from '../collection/collection';

import { PROCESS_DEFINITIONS, XML} from './constants';
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProcessesService extends CollectionService {

  protected override getUrlPrefix(): string {
    return super.getUrlPrefix() + PROCESS_DEFINITIONS;
  }

  public getProcessDiagram(processDefinitionKey: string): Observable<any> {

    this.logger.info('Processes Service: getProcessDiagram()');

    const url = this.getUrlPrefix() + '/' +  processDefinitionKey + '/' + XML;

    const baseHeaders = new HttpHeaders().set('Accept', 'text/xml')
      .set('Content-Type', 'text/xml');

    const httpOptions: any = {
      headers: baseHeaders,
      observe: 'body' as const,
      responseType: 'text',
      params: undefined
    };

    this.logger.info('url: ' + url);
    // this.logger.info('httpOptions: ' + JSON.stringify(httpOptions, null, 2));

    return this.httpClient.get(url, httpOptions).pipe(
      tap(() => {
        this.logger.info('Processes Service: getProcessDiagram() completed');
      })
    );

  }

}
