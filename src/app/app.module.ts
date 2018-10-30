import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';

import { LoggerService } from 'sales';
import { ConsoleLoggerService } from 'sales';

//
// Sales lib
//

// import { SalesModule } from 'sales';

@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    SharedModule

    // SalesModule
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
