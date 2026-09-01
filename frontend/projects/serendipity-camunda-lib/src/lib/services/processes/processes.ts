import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { tap} from 'rxjs/operators';

import { CollectionService } from '../collection/collection';

@Injectable({
  providedIn: 'root'
})
export class ProcessesService extends CollectionService {

  private readonly processesApi = '/v2/process-definitions';

  public getProcessDiagram(processDefinitionKey: string): Observable<any> {

    this.logger.info('Processes Service: getProcessDiagram()');

    // this.logger.info('options: ' + JSON.stringify(options, null, 2));

    return this.http.get(`${this.processesApi}/${processDefinitionKey}/xml`, this.getDefaultHttpGetOptions()).pipe(

      tap(() => {
        this.logger.info('Processes Service: getProcessDiagram() completed');
      })

    );

  }

}



/*

  public getProcessDiagram(processDefinitionKey: string): Observable<string> {

    this.logger.info('Processes Service: getProcessDiagram()');

    // Manually instantiate distinct, override-safe headers
    const xmlHeaders = new HttpHeaders({
      'Content-Type': 'text/xml',
      'Accept': 'text/xml, text/plain'
    });

    // Set responseType cleanly to 'text' as a primitive literal type string config
    const options = {
      headers: xmlHeaders,
      responseType: 'text' as const
    };

    // this.logger.info('options: ' + JSON.stringify(options, null, 2));

    return this.http.get(`${this.processesApi}/${processDefinitionKey}/xml`, options).pipe(

      tap(() => {
        this.logger.info('Processes Service: getProcessDiagram() completed');
      })

    );

  }

*/

/*

export const PROCESS_DEFINITIONS = '/v2/process-definitions';
export const XML = 'xml';

import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CollectionService } from '../collection/collection';

import { PROCESS_DEFINITIONS, XML} from './constants';


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

*/
