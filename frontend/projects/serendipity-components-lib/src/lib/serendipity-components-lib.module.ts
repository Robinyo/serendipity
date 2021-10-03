import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

//
// Utils lib
//

import { AngularMaterialModule, LoggerService, UtilsLibModule  } from 'utils-lib';

//
// Toolbar components
//

import { CommandBarComponent } from './components/command-bar/command-bar.component';

const components = [
  CommandBarComponent
];

@NgModule({
  imports: [
    AngularMaterialModule,
    FlexLayoutModule,
    UtilsLibModule
  ],
  declarations: [
    ...components
  ],
  exports: [
    ...components
  ]
})
export class SerendipityComponentsLibModule {

  constructor(private logger: LoggerService) {
    this.logger.info('Serendipity Components Library Module initialised');
  }

}
