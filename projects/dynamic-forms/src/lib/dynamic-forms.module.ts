import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DynamicFormsConfig } from './models/models';
import { DynamicFormsConfigService } from './services/config.service';

import { DynamicControlDirective } from './angular-material/directives/dynamic-control/dynamic-control.directive';
import { DynamicFormComponent } from './angular-material/containers/dynamic-form/dynamic-form.component';

import { DynamicDatepickerComponent } from './angular-material/components/dynamic-datepicker/dynamic-datepicker.component';
import { DynamicInputComponent } from './angular-material/components/dynamic-input/dynamic-input.component';

//
// Utils lib
//

import { UtilsModule, LoggerService, ConsoleLoggerService } from 'utils';
import { AngularMaterialModule } from 'utils';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    ReactiveFormsModule,
    UtilsModule
    ],
  declarations: [
    DynamicControlDirective,
    DynamicFormComponent,
    DynamicDatepickerComponent,
    DynamicInputComponent
  ],
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [
    DynamicFormComponent
  ],
  entryComponents: [
    DynamicDatepickerComponent,
    DynamicInputComponent
  ]
})
export class DynamicFormsModule {

  static forRoot(config: DynamicFormsConfig): ModuleWithProviders {

    return {
      ngModule: DynamicFormsModule,
      providers: [
        { provide: DynamicFormsConfigService, useValue: config }
      ]
    };

  }

}

// import { TranslateModule } from '@ngx-translate/core';
// TranslateModule.forChild()
