import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TranslateModule } from '@ngx-translate/core';

import { TaskComponent } from './components/task/task.component';
import { TaskListComponent } from './components/task-list/task-list.component';

//
// Utils lib
//

import { UtilsModule, LoggerService } from 'utils';
import { AngularMaterialModule } from 'utils';

//
// Serendipity Components lib
//

import { SerendipityComponentsModule } from 'serendipity-components';

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
    ReactiveFormsModule,
    SerendipityComponentsModule,
    TranslateModule.forChild(),
    UtilsModule
  ],
  declarations: [ TaskComponent, TaskListComponent ],
  exports: [ TaskComponent, TaskListComponent ]
})
export class FlowableModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Flowable Module initialised');
  }

}
