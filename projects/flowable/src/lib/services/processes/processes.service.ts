import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { CollectionService } from '../abstract/collection/collection.service';

const HTTP_SERVER_ERROR_CONNECTION_REFUSED = 'Connection refused';

@Injectable({
  providedIn: 'root'
})
export class ProcessesService extends CollectionService {

  constructor() {

    super();
  }

  public getProcesses(): Observable<any> {

    this.logger.info('ProcessesService: getProcesses()');

    this.url = this.getUrlPrefix() + '/repository/process-definitions';

    // https://flowable.com/open-source/docs/bpmn/ch15-REST/#list-of-process-definitions
    const latest = 'true';

    const params = new HttpParams().set('latest', latest);

    this.logger.info('url: ' + this.url);
    this.logger.info('params: ' + params);

    return this.httpClient.get(this.url, this.getHttpOptions(params)).pipe(

      tap(() => {

        this.logger.info('ProcessesService: getProcesses() completed');

      }),
      catchError(error => {

        this.logger.info('ProcessesService: getProcesses() -> catchError()');

        if (error === undefined) {
          error = new Error(HTTP_SERVER_ERROR_CONNECTION_REFUSED);
        }

        throw error;

      })

    );

  }

  public startProcess(body: any): Promise<any> {

    this.logger.info('ProcessesService: startProcess()');

    this.url = this.getUrlPrefix() + '/runtime/process-instances';

    this.logger.info('url: ' + this.url);

    return this.httpClient.post(this.url, body, this.getHttpOptions()).pipe(

      tap((response: any) => {
      // tap(() => {

        this.logger.info('Process Instance: ' + JSON.stringify(response, null, 2) + '\n');

        this.logger.info('ProcessesService: startProcess() completed');

      })).toPromise().catch(error => {

      if (error === undefined) {
        error = new Error(HTTP_SERVER_ERROR_CONNECTION_REFUSED);
      }

      throw error;

    });

  }

}
