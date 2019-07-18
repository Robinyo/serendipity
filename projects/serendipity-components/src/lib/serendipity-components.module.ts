import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

//
// Bar components
//

import { ActivityBarComponent } from './components/activity-bar/activity-bar.component';
import { CommandBarComponent } from './components/command-bar/command-bar.component';

//
// Dialog components
//

import { AlertDialogComponent } from './components/dialogs/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from './components/dialogs/confirm-dialog/confirm-dialog.component';

//
// Utils lib
//

// import { UtilsModule, LoggerService, ConsoleLoggerService } from 'utils';
import { UtilsModule, LoggerService, loggerProviders } from 'utils';
import { AngularMaterialModule } from 'utils';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    FlexLayoutModule,
    UtilsModule
  ],
  declarations: [
    AlertDialogComponent,
    ConfirmDialogComponent,
    ActivityBarComponent,
    CommandBarComponent ],
  providers: [
    // { provide: LoggerService, useClass: ConsoleLoggerService }
    loggerProviders
  ],
  exports: [
    ActivityBarComponent,
    CommandBarComponent ],
  entryComponents: [
    AlertDialogComponent,
    ConfirmDialogComponent ]
})
export class SerendipityComponentsModule {

  constructor(private logger: LoggerService) {
    this.logger.info('Serendipity Components Module initialised');
  }

}
