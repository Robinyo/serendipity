import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '@app/shared/angular-material.module';

import { MyAddressFormComponent } from './components/samples/my-address-form/my-address-form.component';
import { MyDashboardComponent } from './components/samples/my-dashboard/my-dashboard.component';
import { MyNavComponent } from './components/samples/my-nav/my-nav.component';
import { MyTableComponent } from './components/samples/my-table/my-table.component';
import { MyTreeComponent } from './components/samples/my-tree/my-tree.component';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    MyAddressFormComponent,
    MyDashboardComponent,
    MyNavComponent,
    MyTableComponent,
    MyTreeComponent
  ],
  exports: [
    MyAddressFormComponent,
    MyDashboardComponent,
    MyNavComponent,
    MyTableComponent,
    MyTreeComponent
  ]
})
export class SharedModule { }
