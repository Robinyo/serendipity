import { Inject, Injectable, Injector } from '@angular/core';

import { UtilsConfig } from '../../models/models';
import { UtilsConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class StaticInjectorService {

  private static injector: Injector = null;

  constructor(@Inject(UtilsConfigService) private config: UtilsConfig ) {

    if (this.config.isDebugMode) {
      console.log('Static Injector Service registered');
    }

  }

  static setInjector(injector: Injector) {
    StaticInjectorService.injector = injector;
  }

  static getInjector(): Injector {
    return StaticInjectorService.injector;
  }

}

// https://blogs.msdn.microsoft.com/premier_developer/2018/06/17/angular-how-to-simplify-components-with-typescript-inheritance/

// https://stackoverflow.com/questions/33970645/how-to-extend-a-component-with-dependency-injection-in-angular-2

// console.log('StaticInjectorService: constructor()');
// console.log(JSON.stringify(this.config));
