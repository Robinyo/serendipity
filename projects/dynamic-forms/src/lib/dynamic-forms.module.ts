import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// import { TranslateModule } from '@ngx-translate/core';

import { AngularMaterialModule } from './angular-material/shared/angular-material.module';

import { DynamicFormComponent } from './angular-material/components/dynamic-form/dynamic-form.component';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    ReactiveFormsModule

    // TranslateModule.forChild()
    ],
  declarations: [ DynamicFormComponent ],
  providers: [],
  exports: [ DynamicFormComponent ]
})
export class DynamicFormsModule { }
