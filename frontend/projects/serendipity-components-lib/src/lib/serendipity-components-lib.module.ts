import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from "@angular/platform-browser";
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatIconRegistry } from "@angular/material/icon";

//
// Utils lib
//

import { AngularMaterialModule} from 'utils-lib';
// import { LoggerService, UtilsModule } from 'utils-lib';
import { LoggerService } from 'utils-lib';

//
// Toolbar components
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

import { SVG_ICONS } from './svg-icons';

const components = [
  ActivityBarComponent,
  CommandBarComponent,
  AlertDialogComponent,
  CollectionFooterComponent,
  ConfirmDialogComponent,
  SnackBarComponent
];

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    FlexLayoutModule
  ],
  declarations: [
    ...components
  ],
  exports: [
    ...components
  ],
  entryComponents: [
    ...components
  ]
})
export class SerendipityComponentsLibModule {

  constructor(private domSanitizer: DomSanitizer,
              private matIconRegistry: MatIconRegistry,
              private logger: LoggerService) {

    this.logger.info('Serendipity Components Library initialised');

    const svgIconPath = '../assets/images/icons/';

    SVG_ICONS.forEach(svgIcon => {

      if (svgIcon.name != undefined && svgIcon.filename != undefined) {

        this.matIconRegistry.addSvgIcon(
          svgIcon.name,
          this.domSanitizer.bypassSecurityTrustResourceUrl(svgIconPath + svgIcon.filename)
        );

      }
    });

  }

}
