import { Injector, ModuleWithProviders, NgModule, Type } from '@angular/core';
// import { DomSanitizer } from "@angular/platform-browser";

// import { MatIconRegistry } from "@angular/material/icon";

import { UtilsConfigService } from './services/utils-config.service';
import { StaticInjectorService } from './services/injector/static-injector.service';

import { UtilsConfig } from './models/models';

// import { SVG_ICONS } from './svg-icons';

@NgModule()
export class UtilsLibModule {

  constructor(private staticInjector: StaticInjectorService,
              private injector: Injector) {

    console.log('Utils Library initialised');

    // I'm injecting the StaticInjectorService so that its constructor() will be called and the UtilsConfigService will
    // be injected.

    StaticInjectorService.setInjector(injector);
  }

  static forRoot(config: UtilsConfig): ModuleWithProviders<UtilsLibModule> {

    // UtilsLibModule.loadSvgIcons();

    return {
      ngModule: UtilsLibModule,
      providers: [
        { provide: UtilsConfigService, useValue: config }
      ]
    };

  }

  /*

  private static loadSvgIcons() {

    const injector: Injector = StaticInjectorService.getInjector();

    // main.ts:1 TypeError: Cannot read properties of undefined (reading 'get')

    const domSanitizer: DomSanitizer = injector.get<DomSanitizer>(DomSanitizer as unknown as Type<DomSanitizer>);
    const matIconRegistry: MatIconRegistry = injector.get<MatIconRegistry>(MatIconRegistry as unknown as Type<MatIconRegistry>);

    const svgIconPath = '../assets/images/icons/';

    SVG_ICONS.forEach(svgIcon => {

      if (svgIcon.name != undefined && svgIcon.filename != undefined) {

        matIconRegistry.addSvgIcon(
          svgIcon.name,
          domSanitizer.bypassSecurityTrustResourceUrl(svgIconPath + svgIcon.filename)
        );

      }
    });

  }

  */

}
