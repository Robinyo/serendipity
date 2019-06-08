import { NgModule } from '@angular/core';

import { GridsterModule } from 'angular-gridster2';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { DashboardComponent } from './components/dashboard/dashboard.component';

//
// Utils lib
//

import { UtilsModule } from 'utils';
import { LoggerService } from 'utils';
import { ConsoleLoggerService } from 'utils';

@NgModule({
  imports: [
    GridsterModule,
    NgxChartsModule,
    UtilsModule
  ],
  declarations: [ DashboardComponent ],
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [ DashboardComponent ],
  entryComponents: []
})
export class DashboardModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Dashboard Module initialised');
  }

}
