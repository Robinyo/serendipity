import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

//
// Utils lib
//

import { AngularMaterialModule} from 'utils-lib';
import { LoggerService } from 'utils-lib';

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

  constructor(private logger: LoggerService) {
    this.logger.info('Serendipity Components Library Module initialised');
  }

}
