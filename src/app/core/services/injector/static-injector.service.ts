import { Injectable, Injector } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StaticInjectorService {

  private static injector: Injector;

  static setInjector(injector: Injector) {

    console.log('Static Injector Service registered');

    StaticInjectorService.injector = injector;
  }

  static getInjector(): Injector {
    return StaticInjectorService.injector;
  }

}

// https://blogs.msdn.microsoft.com/premier_developer/2018/06/17/angular-how-to-simplify-components-with-typescript-inheritance/

// https://stackoverflow.com/questions/33970645/how-to-extend-a-component-with-dependency-injection-in-angular-2
