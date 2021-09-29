import { Injectable } from '@angular/core';

import { Logger } from './logger';

// import { LoggerModule } from './logger.module';
// providedIn: LoggerModule

@Injectable({
  providedIn: 'root'
})
export class LoggerService implements Logger {

  public info: any;
  public warn: any;
  public error: any;

}

/*

const noop = (): any => undefined;

@Injectable()
export class NoOpLogger implements Logger {

  get info() {
    return noop;
  }

  get warn() {
    return noop;
  }

  get error() {
    return noop;
  }
}

*/

// The set of built-in Log4j levels includes TRACE, DEBUG, INFO, WARN, ERROR, and FATAL.
