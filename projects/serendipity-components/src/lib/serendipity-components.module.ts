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

import { UtilsModule, LoggerService } from 'utils';
import { AngularMaterialModule } from 'utils';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    FlexLayoutModule,
    UtilsModule
  ],
  declarations: [
    ActivityBarComponent,
    CommandBarComponent,
    AlertDialogComponent,
    ConfirmDialogComponent
  ],
  exports: [
    ActivityBarComponent,
    CommandBarComponent,
    AlertDialogComponent,
    ConfirmDialogComponent
  ],
  entryComponents: [
    ActivityBarComponent,
    CommandBarComponent,
    AlertDialogComponent,
    ConfirmDialogComponent
  ]
})
export class SerendipityComponentsModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Serendipity Components Module initialised');
  }

}
