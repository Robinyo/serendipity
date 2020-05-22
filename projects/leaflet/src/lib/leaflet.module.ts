import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapComponent } from './components/map/map.component';

//
// Utils lib
//

import { UtilsModule, LoggerService } from 'utils';

@NgModule({
  imports: [
    CommonModule,
    // LeafletModule,
    UtilsModule
  ],
  declarations: [
    MapComponent
  ],
  exports: [
    MapComponent
  ]
})
export class LeafletModule {

  constructor(private logger: LoggerService) {
    this.logger.info('Dashboard Module initialised');
  }

}
