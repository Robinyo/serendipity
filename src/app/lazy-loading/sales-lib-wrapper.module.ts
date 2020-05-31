import { NgModule } from '@angular/core';

import { SalesModule } from 'sales';

@NgModule({
  imports: [ SalesModule ]
})
export class SalesLibWrapperModule {}

// import { environment } from '@env/environment';
// imports: [ SalesModule.forRoot(environment) ]
