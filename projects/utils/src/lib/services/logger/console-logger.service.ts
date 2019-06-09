import { Inject, Injectable } from '@angular/core';

import { Logger } from './logger';

import { UtilsConfig } from '../../models/models';
import { UtilsConfigService } from '../config.service';

const noop = (): any => undefined;

@Injectable({
  providedIn: 'root'
})
export class ConsoleLoggerService implements Logger {

  constructor(@Inject(UtilsConfigService) private config: UtilsConfig) {

    if (this.config.isDebugMode) {
      console.log('Console Logger Service registered');
    }

  }

  get info() {
    if (this.config.isDebugMode) {
      return console.info.bind(console);
    } else {
      return noop;
    }
  }

  get warn() {
    if (this.config.isDebugMode) {
      return console.warn.bind(console);
    } else {
      return noop;
    }
  }

  get error() {
    if (this.config.isDebugMode) {
      return console.error.bind(console);
    } else {
      return noop;
    }
  }

}

// https://stackoverflow.com/questions/13815640/a-proper-wrapper-for-console-log-with-correct-line-number
// https://stackoverflow.com/questions/28668759/what-does-this-statement-do-console-log-bindconsole
// https://gist.github.com/ytiurin/7e5f57809e3e6eeac616

// console.log('ConsoleLoggerService: constructor()');
// console.log(JSON.stringify(this.config));

/*

import { Inject, Injectable } from '@angular/core';

import { Logger } from './logger';

import { UtilsConfigService } from '../config.service';
import { UtilsConfig } from '../../shared/models';

const noop = (): any => undefined;

@Injectable({
  providedIn: 'root'
})
export class ConsoleLoggerService implements Logger {

  constructor(@Inject('UtilsConfigService') private config: UtilsConfig ) {

    if (this.config.isDebugMode) {
      console.log('Console Logger Service registered');
    }

  }

  get info() {
    if (this.config.isDebugMode) {
      return console.info.bind(console);
    } else {
      return noop;
    }
  }

  get warn() {
    if (this.config.isDebugMode) {
      return console.warn.bind(console);
    } else {
      return noop;
    }
  }

  get error() {
    if (this.config.isDebugMode) {
      return console.error.bind(console);
    } else {
      return noop;
    }
  }

}

*/

// import { environment } from '@env/environment'; // inject via forRoot()

// const isDebugMode = environment.isDebugMode;
// const isDebugMode = true;

// import { LoggerModule } from './logger.module';
// providedIn: LoggerModule

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
