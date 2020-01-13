import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

//
// Utils lib
//

import { UtilsModule, LoggerService } from 'utils';
import { AngularMaterialModule } from 'utils';

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
// Misc components
//

import { CollectionFooterComponent } from './components/abstract/collection/footer/collection-footer.component';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';

const serendipityComponents = [
  ActivityBarComponent,
  CommandBarComponent,
  AlertDialogComponent,
  CollectionFooterComponent,
  ConfirmDialogComponent,
  SnackBarComponent
] ;

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    FlexLayoutModule,
    UtilsModule
  ],
  declarations: [
    ...serendipityComponents
    ],
  exports: [
    ...serendipityComponents
    ],
  entryComponents: [
    ...serendipityComponents
  ]
})
export class SerendipityComponentsModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Serendipity Components Module initialised');
  }

}
