import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { FlexLayoutModule } from '@angular/flex-layout';

import { AngularMaterialModule } from './angular-material.module';

import { TaskListComponent } from './components/task-list/task-list.component';

//
// Utils lib
//

import { UtilsModule } from 'utils';
import { LoggerService } from 'utils';
import { ConsoleLoggerService } from 'utils';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    FlexLayoutModule,
    TranslateModule.forChild(),
    UtilsModule
  ],
  declarations: [ TaskListComponent ],
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [ TaskListComponent ]
})
export class FlowableModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Flowable Module initialised');
  }

}
