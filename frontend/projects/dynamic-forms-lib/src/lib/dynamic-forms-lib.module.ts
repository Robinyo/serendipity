import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

//
// Libs
//

import { AngularMaterialModule, LoggerService, UtilsLibModule } from 'utils-lib';

//
// Components - local
//

import { DynamicControlDirective } from './angular-material/directives/dynamic-control/dynamic-control.directive';
import { DynamicFormComponent } from './angular-material/containers/dynamic-form/dynamic-form.component';

// import { DynamicCheckboxComponent } from './angular-material/components/dynamic-checkbox/dynamic-checkbox.component';
import { DynamicDatepickerComponent } from './angular-material/components/dynamic-datepicker/dynamic-datepicker.component';
import { DynamicImageComponent } from './angular-material/components/dynamic-image/dynamic-image.component';
import { DynamicInputComponent } from './angular-material/components/dynamic-input/dynamic-input.component';
import { DynamicLabelComponent } from './angular-material/components/dynamic-label/dynamic-label.component';

const components: any[] = [
  // DynamicCheckboxComponent,
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
    UtilsLibModule
  ],
  declarations: [
    DynamicControlDirective,
    DynamicFormComponent,
    ...components
  ],
  exports: [
    DynamicFormComponent
  ],

  // https://angular.io/guide/deprecations#entrycomponents-and-analyze_for_entry_components-no-longer-required
  // NOTE: You may still need to keep these if building a library that will be consumed by a View Engine application.

  entryComponents: [
    ...components
  ]
})
export class DynamicFormsLibModule {

  constructor(private logger: LoggerService) {

    this.logger.info('Dynamic Forms Library initialised');
  }

}
