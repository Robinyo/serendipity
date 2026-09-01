import { inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LoggerService } from '../../logger/logger.service';

// Abstract parents MUST have a decorator to preserve DI metadata shapes

@Injectable()
export abstract class AbstractCollectionService {

  // Declare properties without inline injection to stabilise cross-lib evaluation

  protected http!: HttpClient;
  protected logger!: LoggerService;

  protected constructor() {
    this.http = inject(HttpClient);
    this.logger = inject(LoggerService);
  }

  // See: The http interceptor

  protected getDefaultHttpOptions(params: any = undefined): { params?: any } {
    return params ? { params } : {};
  }

  protected getDefaultHttpGetOptions(params: any = undefined): { params?: any } {
    return params ? { params } : {};
  }

  protected getDefaultHttpPostOptions(params: any = undefined): { params?: any } {
    return params ? { params } : {};
  }

  protected getDefaultHttpPutOptions(params: any = undefined): { params?: any } {
    return params ? { params } : {};
  }

  protected getDefaultHttpDeleteOptions(params: any = undefined): { params?: any } {
    return params ? { params } : {};
  }

}

// https://angular.dev/guide/http/making-requests
