import { Injectable, isDevMode } from '@angular/core';

import { Logger } from './logger';

const noop = (): any => undefined;

@Injectable({
  providedIn: 'root'
})
export class ConsoleLoggerService implements Logger {

  get info() {
    if (isDevMode()) {
      return console.info.bind(console);
    } else {
      return noop;
    }
  }

  get warn() {
    if (isDevMode()) {
      return console.warn.bind(console);
    } else {
      return noop;
    }
  }

  get error() {
    if (isDevMode()) {
      return console.error.bind(console);
    } else {
      return noop;
    }
  }

}
