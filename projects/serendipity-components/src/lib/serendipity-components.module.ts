import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { AngularMaterialModule } from './shared/angular-material.module';

//
// Utils lib
//

import { UtilsModule } from 'utils';
import { LoggerService } from 'utils';
import { ConsoleLoggerService } from 'utils';

import { CommandBarComponent } from './components/command-bar/command-bar.component';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    FlexLayoutModule,
    UtilsModule
  ],
  declarations: [ CommandBarComponent ],
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [ CommandBarComponent ]
})
export class SerendipityComponentsModule {}
