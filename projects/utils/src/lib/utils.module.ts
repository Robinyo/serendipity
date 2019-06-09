import { NgModule, ModuleWithProviders } from '@angular/core';

import { UtilsConfig } from './models/models';
import { UtilsConfigService } from './services/config.service';

import { StaticInjectorService } from './services/injector/static-injector.service';

@NgModule()
export class UtilsModule {

  constructor(private staticInjector: StaticInjectorService) {

    // I'm injecting the StaticInjectorService so that its constructor() will be called and the UtilsConfigService injected.
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
