import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injector, Type } from '@angular/core';

import { EnvironmentService } from '../../environment/environment.service';
import { LoggerService } from '../../logger/logger.service';
import { StaticInjectorService } from '../../injector/static-injector.service';

import { HttpOptions } from '../../../models/http-options';
import { UtilsConfig } from '../../../models/models';

export abstract class CollectionService {

  protected config: UtilsConfig;
  protected httpOptions: HttpOptions;
  protected url: string;

  protected environmentService: EnvironmentService;
  protected httpClient: HttpClient;
  protected logger: LoggerService;

  constructor() {

    const injector: Injector = StaticInjectorService.getInjector();

    this.environmentService = injector.get<EnvironmentService>(EnvironmentService as Type<EnvironmentService>);
    this.httpClient = injector.get<HttpClient>(HttpClient as Type<HttpClient>);
    this.logger = injector.get<LoggerService>(LoggerService as Type<LoggerService>);

    this.config = this.environmentService.getConfig();
  }

  protected getUrlPrefix(): string {
    return this.config.serverScheme + '://' + this.config.serverHost + ':' + this.config.serverPort;
  }

  protected getHttpOptions(params: HttpParams = null): HttpOptions {

    // this.logger.info('CollectionService: getHttpOptions()');

    if (!this.httpOptions) {

      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        params: null
      };

    }

    this.httpOptions.params = params;

    // this.logger.info('httpOptions: ' + JSON.stringify(this.httpOptions, null, 2));

    return this.httpOptions;
  }

}
