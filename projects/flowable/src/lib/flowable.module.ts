import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TranslateModule } from '@ngx-translate/core';

//
// Dynamic Forms lib
//

import { DynamicFormsModule } from 'dynamic-forms';

//
// Serendipity Components lib
//

import { SerendipityComponentsModule } from 'serendipity-components';

//
// Utils lib
//

import { UtilsModule, LoggerService } from 'utils';
import { AngularMaterialModule } from 'utils';

//
// Components
//

import { ProcessListComponent } from './components/process-list/process-list.component';
import { TaskComponent } from './components/task/task.component';
import { TaskListComponent } from './components/task-list/task-list.component';

import { StartProcessDialogComponent } from './components/dialogs/start-process-dialog/start-process-dialog.component';

const components: any[] = [
  ProcessListComponent,
  StartProcessDialogComponent,
  TaskComponent,
  TaskListComponent
];

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
  declarations: [
    ...components
  ],
  exports: [
    ...components
  ]
})
export class FlowableModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Flowable Module initialised');
  }

}
