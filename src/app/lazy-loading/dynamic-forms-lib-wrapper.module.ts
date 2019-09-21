import { NgModule } from '@angular/core';

import { DynamicFormsModule } from 'dynamic-forms';

// import { environment } from '@env/environment';

@NgModule({
  imports: [
    // DynamicFormsModule.forRoot(environment)
    DynamicFormsModule
  ]
})
export class DynamicFormsLibWrapperModule {}

// See: app.module.ts Lazy Loaded Libs -> forRoot()
