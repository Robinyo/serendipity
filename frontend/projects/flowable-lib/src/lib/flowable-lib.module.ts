import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

//
// Libs
//

import { DynamicFormsLibModule } from 'dynamic-forms-lib';
import { SerendipityComponentsLibModule } from 'serendipity-components-lib';
import { AngularMaterialModule, LoggerService, UtilsLibModule } from 'utils-lib';

//
// Components - local
//

import { ProcessListComponent } from './components/process-list/process-list.component';
import { TaskComponent } from './components/task/task.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskListFilterComponent } from './components/task-list-filter/task-list-filter.component';

import { StartProcessDialogComponent } from './components/dialogs/start-process-dialog/start-process-dialog.component';

const components: any[] = [
  ProcessListComponent,
  StartProcessDialogComponent,
  TaskComponent,
  TaskListComponent,
  TaskListFilterComponent
];

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    DynamicFormsLibModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    SerendipityComponentsLibModule,
    UtilsLibModule
  ],
  declarations: [
    ...components
  ],
  exports: [
    ...components
  ]
})
export class FlowableLibModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Flowable Library initialised');
  }

}
