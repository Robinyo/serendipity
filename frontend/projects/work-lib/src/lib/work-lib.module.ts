import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

// import { QuillModule } from 'ngx-quill';

//
// Libs
//

import { DynamicFormsLibModule } from 'dynamic-forms-lib';
import { FlowableLibModule } from 'flowable-lib';

import { AngularMaterialModule } from 'utils-lib';
import { LoggerService } from 'utils-lib';
import { SerendipityComponentsLibModule } from 'serendipity-components-lib';
// import { UtilsLibModule } from 'utils-lib';

//
// Components - local
//

import { ActivitiesComponent } from './components/activities/activities.component';
import { TasksComponent } from './components/tasks/tasks.component';

//
// WorkLibRoutingModule: https://angular.io/guide/router#routing-module-order
//

import { WorkLibRoutingModule } from './work-lib-routing.module';

const components: any[] = [
  ActivitiesComponent,
  TasksComponent
];

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    DynamicFormsLibModule,
    FlexLayoutModule,
    FlowableLibModule,
    ReactiveFormsModule,
    SerendipityComponentsLibModule,

    // See core.module.ts
    // UtilsLibModule,

    // https://angular.io/guide/router#routing-module-order
    WorkLibRoutingModule

  ],
  declarations: [
    ...components
  ],
})
export class WorkLibModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Work Library initialised');
  }

}
