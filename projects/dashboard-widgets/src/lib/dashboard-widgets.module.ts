import { NgModule } from '@angular/core';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { NumberCardComponent } from './components/number-card/number-card.component';

//
// Utils lib
//

import { UtilsModule, LoggerService, ConsoleLoggerService } from 'utils';

@NgModule({
  imports: [
    NgxChartsModule,
    UtilsModule
  ],
  declarations: [ NumberCardComponent ],
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [ NumberCardComponent ],
  entryComponents: []
})
export class DashboardWidgetsModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Dashboard Widgets Module initialised');
  }

}
