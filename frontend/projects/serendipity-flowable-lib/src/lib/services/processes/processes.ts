import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Observable} from 'rxjs';
import { tap } from 'rxjs/operators';

import { HttpOptions } from 'serendipity-utils-lib';

import { CollectionService } from '../collection/collection';

import {
  HTTP_SERVER_ERROR_CONNECTION_REFUSED,
  PROCESS_DEFINITIONS_WITHOUT_A_TRAILING_SLASH,
  PROCESS_INSTANCES,
  PROCESS_INSTANCES_WITHOUT_A_TRAILING_SLASH
} from './constants';

@Injectable({
  providedIn: 'root'
})
export class ProcessesService extends CollectionService {

  constructor() {
    super();
  }

  // https://www.flowable.com/open-source/docs/bpmn/ch14-REST#list-of-process-definitions

  public find(params: any = undefined): Observable<any> {

    this.logger.info('Processes Service: find()');

    // this.url = this.getUrlPrefix() + '/process-api/repository/process-definitions';
    const url = this.getUrlPrefix() + PROCESS_DEFINITIONS_WITHOUT_A_TRAILING_SLASH;

    // const latest = 'true';
    // const params = new HttpParams().set('latest', latest);

    this.logger.info('url: ' + url);
    this.logger.info('params: ' + params);

    return this.httpClient.get(url, this.getDefaultHttpGetOptions(params)).pipe(
    // return this.httpClient.get(url).pipe(
      tap(() => {
        this.logger.info('Processes Service: find() completed');
      })
    );

  }

  public findById(id: string): Observable<any> {

    this.logger.info('Processes Service: findById()');

    // this.url = this.getUrlPrefix() + '/process-api/runtime/process-instances/' + id;
    const url = this.getUrlPrefix() + PROCESS_INSTANCES + id;

    this.logger.info('url: ' + url);

    return this.httpClient.get(url, this.getDefaultHttpGetOptions()).pipe(
      tap(() => {
        this.logger.info('Processes Service: findById() completed');
      })
    );

  }

  public getDiagram(id: string): Promise<Blob> {

    this.logger.info('Processes Service: getDiagram()');

    // this.url = this.getUrlPrefix() + '/process-api/runtime/process-instances/' + id + '/diagram';
    const url = this.getUrlPrefix() + PROCESS_INSTANCES + id + '/diagram';

    this.logger.info('url: ' + url);

    const defaultOptions: HttpOptions = this.getDefaultHttpGetOptions();

    return this.httpClient.get(url, {
      headers: defaultOptions.headers,
      params: defaultOptions.params,
      responseType: 'blob'
    }).pipe(

      tap((response: any) => {
        // tap(() => {

        this.logger.info('Processes Service: getDiagram() completed');

      })).toPromise().catch(error => {

      if (error === undefined) {
        error = new Error(HTTP_SERVER_ERROR_CONNECTION_REFUSED);
      }

      throw error;

    });

  }

  public startProcess(request: any): Promise<any> {

    this.logger.info('Processes Service: startProcess()');

    // this.url = this.getUrlPrefix() + '/process-api/runtime/process-instances';
    const url = this.getUrlPrefix() + PROCESS_INSTANCES_WITHOUT_A_TRAILING_SLASH;

    this.logger.info('url: ' + url);

    return this.httpClient.post(url, request, this.getDefaultHttpPostOptions()).pipe(

      tap((response: any) => {
      // tap(() => {

        this.logger.info('Process Instance: ' + JSON.stringify(response, null, 2) + '\n');

        this.logger.info('Processes Service: startProcess() completed');

      })).toPromise().catch(error => {

      if (error === undefined) {
        error = new Error(HTTP_SERVER_ERROR_CONNECTION_REFUSED);
      }

      throw error;

    });

  }

  public addRole(id: string, request: any): Promise<any> {

    this.logger.info('Processes Service: addRole()');

    // this.url = this.getUrlPrefix() + '/process-api/runtime/process-instances/' + id + '/identitylinks';
    const url = this.getUrlPrefix() + PROCESS_INSTANCES + id + + '/identitylinks';

    this.logger.info('url: ' + url);

    return this.httpClient.post(url, request, this.getDefaultHttpPostOptions()).pipe(

      tap((response: any) => {
        // tap(() => {

        this.logger.info('Process Instance: ' + JSON.stringify(response, null, 2) + '\n');

        this.logger.info('Processes Service: addRole() completed');

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
