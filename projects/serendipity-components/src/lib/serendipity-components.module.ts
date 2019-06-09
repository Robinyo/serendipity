import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { AlertDialogComponent } from './components/dialogs/alert-dialog/alert-dialog.component';
import { CommandBarComponent } from './components/command-bar/command-bar.component';

//
// Utils lib
//

import { UtilsModule, LoggerService, ConsoleLoggerService } from 'utils';
import { AngularMaterialModule } from 'utils';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    FlexLayoutModule,
    UtilsModule
  ],
  declarations: [ AlertDialogComponent, CommandBarComponent ],
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [ CommandBarComponent ],
  entryComponents: [ AlertDialogComponent ]
})
export class SerendipityComponentsModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Serendipity Components Module initialised');
  }

}
