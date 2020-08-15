import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TranslateModule } from '@ngx-translate/core';

import { QuillModule } from 'ngx-quill';

import { WorkConfig } from './models/config';
import { WorkConfigService } from './services/config.service';

//
// Dashboard lib
//

import { DashboardModule } from 'dashboard';

//
// Dynamic Forms lib
//

import { DynamicFormsModule } from 'dynamic-forms';

//
// Flowable lib
//

import { FlowableModule } from 'flowable';

//
// Leaflet
//

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

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

import { ActivitiesComponent } from './components/activities/activities.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

//
// LibRoutingModule: https://angular.io/guide/router#routing-module-order
//

import { LibRoutingModule } from './lib-routing.module';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    DashboardModule,
    FlexLayoutModule,
    FlowableModule,
    QuillModule.forRoot({
      placeholder: ''
    }),
    LeafletModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    UtilsModule,
    SerendipityComponentsModule,
    DynamicFormsModule,

    // https://angular.io/guide/router#routing-module-order
    LibRoutingModule
  ],
  declarations: [
    ActivitiesComponent,
    DashboardComponent
  ]
})
export class WorkModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Work Module initialised');
  }

  static forRoot(config: WorkConfig): ModuleWithProviders<WorkModule> {

    return {
      ngModule: WorkModule,
      providers: [
        { provide: WorkConfigService, useValue: config }
      ]
    };

  }

}
