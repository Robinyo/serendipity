import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';

//
// Utils lib
//

import { UtilsModule } from 'utils';
import { LoggerService } from 'utils';
import { ConsoleLoggerService } from 'utils';

@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    SharedModule,
    UtilsModule
  ],
  declarations: [ AppComponent ],
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

  constructor(private logger: LoggerService) {}

}

/*

// import { AppRoutingModule } from './app-routing.module';
// AppRoutingModule,

// import { StaticInjectorService } from '@app/core';

Injector

  constructor(public injector: Injector) {

    StaticInjectorService.setInjector(injector);
  }

*/
