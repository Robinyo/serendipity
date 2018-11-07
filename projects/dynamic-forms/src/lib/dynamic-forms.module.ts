import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// import { TranslateModule } from '@ngx-translate/core';

import { AngularMaterialModule } from './angular-material/shared/angular-material.module';

import { DynamicFormComponent } from './angular-material/containers/dynamic-form/dynamic-form.component';

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
    ReactiveFormsModule,

    // TranslateModule.forChild()

    UtilsModule
    ],
  declarations: [ DynamicFormComponent ],
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [ DynamicFormComponent ]
})
export class DynamicFormsModule { }
