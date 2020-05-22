import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { MapComponent } from './components/map/map.component';

//
// Utils lib
//

import { UtilsModule, LoggerService } from 'utils';
@NgModule({
  imports: [
    CommonModule,
    LeafletModule,
    UtilsModule
  ],
  declarations: [
    MapComponent
  ],
  exports: [
    MapComponent
  ]
})
export class MapsModule {

  constructor(private logger: LoggerService) {
    this.logger.info('Dashboard Module initialised');
  }

}
