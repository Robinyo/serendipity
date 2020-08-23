import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { CollectionService } from 'utils';

const HTTP_SERVER_ERROR_CONNECTION_REFUSED = 'Connection refused';

@Injectable({
  providedIn: 'root'
})
export class ProcessesService extends CollectionService {

  constructor() {
    super();
  }

  public find(): Observable<any> {

    this.logger.info('ProcessesService: getProcesses()');

    this.url = this.getUrlPrefix() + '/process-api/repository/process-definitions';

    // https://flowable.com/open-source/docs/bpmn/ch15-REST/#list-of-process-definitions
    const latest = 'true';

    const params = new HttpParams().set('latest', latest);

    this.logger.info('url: ' + this.url);
    this.logger.info('params: ' + params);

    return this.httpClient.get(this.url, this.getHttpOptions(params)).pipe(
      tap(() => {
        this.logger.info('ProcessesService: find() completed');
      })
    );

  }

  public findById(id: string): Observable<any> {

    this.logger.info('ProcessesService: getProcess()');

    this.url = this.getUrlPrefix() + '/process-api/runtime/process-instances/' + id;

    this.logger.info('url: ' + this.url);

    return this.httpClient.get(this.url).pipe(
      tap(() => {
        this.logger.info('ProcessesService: findById() completed');
      })
    );

  }

  public startProcess(request: any): Promise<any> {

    this.logger.info('ProcessesService: startProcess()');

    this.url = this.getUrlPrefix() + '/process-api/runtime/process-instances';

    this.logger.info('url: ' + this.url);

    return this.httpClient.post(this.url, request, this.getHttpOptions()).pipe(

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

  public updateProcess(processId: string, request: any): Promise<any> {

    this.logger.info('ProcessesService: updateProcess()');

    this.url = this.getUrlPrefix() + '/process-api/runtime/process-instances/' + processId + '/identitylinks';

    this.logger.info('url: ' + this.url);

    return this.httpClient.post(this.url, request, this.getHttpOptions()).pipe(

      tap((response: any) => {
        // tap(() => {

        this.logger.info('Process Instance: ' + JSON.stringify(response, null, 2) + '\n');

        this.logger.info('ProcessesService: updateProcess() completed');

      })).toPromise().catch(error => {

      if (error === undefined) {
        error = new Error(HTTP_SERVER_ERROR_CONNECTION_REFUSED);
      }

      throw error;

    });

  }

}

/*

  public getProcess(processId: string): Promise<any> {

    this.logger.info('ProcessesService: getProcess()');

    this.url = this.getUrlPrefix() + '/process-api/runtime/process-instances/' + processId;

    this.logger.info('url: ' + this.url);

    return this.httpClient.get(this.url, this.getHttpOptions()).pipe(

      tap((response: any) => {
        // tap(() => {

        this.logger.info('Process Instance: ' + JSON.stringify(response, null, 2) + '\n');

        this.logger.info('ProcessesService: getProcess() completed');

      })).toPromise().catch(error => {

      if (error === undefined) {
        error = new Error(HTTP_SERVER_ERROR_CONNECTION_REFUSED);
      }

      throw error;

    });

  }

  public getProcesses(): Observable<any> {

    this.logger.info('ProcessesService: getProcesses()');

    this.url = this.getUrlPrefix() + '/process-api/repository/process-definitions';

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

  public startProcess(request: any): Promise<any> {

    this.logger.info('ProcessesService: startProcess()');

    this.url = this.getUrlPrefix() + '/process-api/runtime/process-instances';

    this.logger.info('url: ' + this.url);

    return this.httpClient.post(this.url, request, this.getHttpOptions()).pipe(

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

  public updateProcess(processId: string, request: any): Promise<any> {

    this.logger.info('ProcessesService: updateProcess()');

    this.url = this.getUrlPrefix() + '/process-api/runtime/process-instances/' + processId + '/identitylinks';

    this.logger.info('url: ' + this.url);

    return this.httpClient.post(this.url, request, this.getHttpOptions()).pipe(

      tap((response: any) => {
        // tap(() => {

        this.logger.info('Process Instance: ' + JSON.stringify(response, null, 2) + '\n');

        this.logger.info('ProcessesService: updateProcess() completed');

      })).toPromise().catch(error => {

      if (error === undefined) {
        error = new Error(HTTP_SERVER_ERROR_CONNECTION_REFUSED);
      }

      throw error;

    });

  }

*/
