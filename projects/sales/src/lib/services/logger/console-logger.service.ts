import { Injectable } from '@angular/core';

import { Logger } from './logger';

// import { environment } from '@env/environment'; // inject via forRoot()

// const isDebugMode = environment.isDebugMode;
const isDebugMode = true;
const noop = (): any => undefined;

// import { LoggerModule } from './logger.module';
// providedIn: LoggerModule

@Injectable({
  providedIn: 'root'
})
export class ConsoleLoggerService implements Logger {

  constructor() {
    console.log('Console Logger Service registered');
  }

  get info() {
    if (isDebugMode) {
      return console.info.bind(console);
    } else {
      return noop;
    }
  }

  get warn() {
    if (isDebugMode) {
      return console.warn.bind(console);
    } else {
      return noop;
    }
  }

  get error() {
    if (isDebugMode) {
      return console.error.bind(console);
    } else {
      return noop;
    }
  }

}

// https://stackoverflow.com/questions/13815640/a-proper-wrapper-for-console-log-with-correct-line-number
// https://stackoverflow.com/questions/28668759/what-does-this-statement-do-console-log-bindconsole
// https://gist.github.com/ytiurin/7e5f57809e3e6eeac616

/*

@Injectable({
  providedIn: 'root'
})
export class ConsoleLoggerService implements Logger {

  get info() {
    if (isDebugMode) {
      return console.info.bind(console);
    } else {
      return noop;
    }
  }

  get warn() {
    if (isDebugMode) {
      return console.warn.bind(console);
    } else {
      return noop;
    }
  }

  get error() {
    if (isDebugMode) {
      return console.error.bind(console);
    } else {
      return noop;
    }
  }

}

*/
