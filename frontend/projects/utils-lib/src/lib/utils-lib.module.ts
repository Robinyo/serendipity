import { Injector, ModuleWithProviders, NgModule } from '@angular/core';

import { UtilsConfig } from './models/models';

import { UtilsConfigService } from './services/utils-config.service';
import { StaticInjectorService } from './services/injector/static-injector.service';

@NgModule()
export class UtilsLibModule {

  constructor(private staticInjector: StaticInjectorService,
              private injector: Injector) {

    console.log('Utils Library initialised');

    // I'm injecting the StaticInjectorService so that its constructor() will be called and the UtilsConfigService injected.

    StaticInjectorService.setInjector(injector);
  }

  static forRoot(config: UtilsConfig): ModuleWithProviders<UtilsLibModule> {

    return {
      ngModule: UtilsLibModule,
      providers: [
        { provide: UtilsConfigService, useValue: config }
      ]
    };

  }

}
