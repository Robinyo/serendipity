import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { FlexLayoutModule } from '@angular/flex-layout';

import { TaskComponent } from './components/task/task.component';
import { TaskListComponent } from './components/task-list/task-list.component';

//
// Auth libs
//

// import { AuthModule } from 'auth';
// import { AuthOktaModule, authProviders } from 'auth-okta';

//
// Utils lib
//

// import { UtilsModule, LoggerService, ConsoleLoggerService } from 'utils';
import { UtilsModule, LoggerService, loggerProviders } from 'utils';
import { AngularMaterialModule } from 'utils';

//
// Dynamic Forms lib
//

import { DynamicFormsModule } from 'dynamic-forms';

@NgModule({
  imports: [
    AngularMaterialModule,
    // AuthModule,
    // AuthOktaModule,
    CommonModule,
    DynamicFormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    UtilsModule
  ],
  declarations: [ TaskComponent, TaskListComponent ],
  providers: [
    // authProviders,
    loggerProviders
  ],
  exports: [ TaskComponent, TaskListComponent ]
})
export class FlowableModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Flowable Module initialised');
  }

}
