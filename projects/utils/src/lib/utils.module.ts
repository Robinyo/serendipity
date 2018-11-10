import {NgModule, ModuleWithProviders, Injector, Inject} from '@angular/core';

import { UtilsConfig } from './shared/models';
import { UtilsConfigService } from './services/config.service';

import { StaticInjectorService } from './services/injector/static-injector.service';

@NgModule()
export class UtilsModule {

  constructor(private staticInjector: StaticInjectorService) {

    // I'm injecting the StaticInjectorService so that its constructor() is called and the UtilsConfigService is injected.
  }

  static forRoot(config: UtilsConfig): ModuleWithProviders {

    // ng build --prod
    // ERROR in Error during template compile of 'CoreModule'
    // Function calls are not supported in decorators but 'UtilsModule' was called.
    // console.log('UtilsModule: forRoot()');
    // console.log(JSON.stringify(config));

    return {
      ngModule: UtilsModule,
      providers: [
        { provide: UtilsConfigService, useValue: config }
      ]
    };
  }

}

// http://angularfirst.com/the-ngmodule-forroot-convention/
// https://stackoverflow.com/questions/43292628/pass-config-data-using-forroot
// https://medium.com/@michelestieven/angular-writing-configurable-modules-69e6ea23ea42

/*

export class SampleModule {
  static forRoot(config: CustomConfig): ModuleWithProviders {
    // User config get logged here
    console.log(config);
    return {
      ngModule: SampleModule,
      providers: [SampleService, {provide: 'config', useValue: config}]
    };
  }
}

*/

/*

{ provide: UtilsConfigService, useFactory: () => config }
{ provide: UtilsConfigService, useValue: config }

import { NgModule, ModuleWithProviders } from '@angular/core';

import { ConsoleLoggerService } from './services/logger/console-logger.service';

import { UtilsConfigService } from './services/config.service';
import { UtilsConfig } from './shared/models';

@NgModule()
export class UtilsModule {

  static forRoot(config: UtilsConfig): ModuleWithProviders {
    return {
      ngModule: UtilsModule,
      providers: [
        { provide: UtilsConfigService, useValue: config }
      ]
    };
  }

}


*/
