import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { FlexLayoutModule } from '@angular/flex-layout';

import { AngularMaterialModule } from './angular-material.module';

import { TaskComponent } from './components/task/task.component';
import { TaskListComponent } from './components/task-list/task-list.component';

//
// Utils lib
//

import { UtilsModule } from 'utils';
import { LoggerService } from 'utils';
import { ConsoleLoggerService } from 'utils';

//
// Dynamic Forms lib
//

import { DynamicFormsModule } from 'dynamic-forms';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    DynamicFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    UtilsModule
  ],
  declarations: [ TaskComponent, TaskListComponent ],
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [ TaskComponent, TaskListComponent ]
})
export class FlowableModule {

  constructor(private logger: LoggerService) {
    this.logger.info('Flowable Module initialised');
  }

}
