import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule, UtilsModule, LoggerService } from 'utils';

import { DynamicControlDirective } from './angular-material/directives/dynamic-control/dynamic-control.directive';
import { DynamicFormComponent } from './angular-material/containers/dynamic-form/dynamic-form.component';

import { DynamicDatepickerComponent } from './angular-material/components/dynamic-datepicker/dynamic-datepicker.component';
import { DynamicImageComponent } from './angular-material/components/dynamic-image/dynamic-image.component';
import { DynamicInputComponent } from './angular-material/components/dynamic-input/dynamic-input.component';
import { DynamicLabelComponent } from './angular-material/components/dynamic-label/dynamic-label.component';

import { DynamicFormsConfig } from './models/models';
import { DynamicFormsConfigService } from './services/config.service';

const components: any[] = [
  DynamicDatepickerComponent,
  DynamicImageComponent,
  DynamicInputComponent,
  DynamicLabelComponent
];

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
    ...components
  ],
  exports: [
    DynamicFormComponent
  ],
  entryComponents: [ ...components ]
})
export class DynamicFormsModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Dynamic Forms Module initialised');
  }

  static forRoot(config: DynamicFormsConfig): ModuleWithProviders<DynamicFormsModule> {

    return {
      ngModule: DynamicFormsModule,
      providers: [
        { provide: DynamicFormsConfigService, useValue: config }
      ]
    };

  }

}
