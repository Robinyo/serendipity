import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { DynamicFormsConfig } from './shared/models';
import { DynamicFormsConfigService } from './services/config.service';

import { AngularMaterialModule } from './shared/angular-material.module';

import { DynamicControlDirective } from './angular-material/directives/dynamic-control/dynamic-control.directive';
import { DynamicFormComponent } from './angular-material/containers/dynamic-form/dynamic-form.component';
import { DynamicInputComponent } from './angular-material/components/dynamic-input/dynamic-input.component';

//
// Utils lib
//

import { UtilsModule } from 'utils';
import { LoggerService } from 'utils';
import { ConsoleLoggerService } from 'utils';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    // HttpClientModule,
    ReactiveFormsModule,
    UtilsModule
    ],
  declarations: [ DynamicFormComponent, DynamicInputComponent, DynamicControlDirective ],
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [ DynamicFormComponent ],
  entryComponents: [ DynamicInputComponent ]
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
