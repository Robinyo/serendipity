import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ActivitiesComponent } from './components/activities/activities.component';

import { CanActivateGuard } from './guards/can-activate/can-activate.guard';
import { CanDeactivateGuard } from './guards/can-deactivate/can-deactivate.guard';

const routes: Routes = [

  {
    path: 'sales/activities',
    component: ActivitiesComponent,
    canActivate: [CanActivateGuard],
    canDeactivate: [CanDeactivateGuard]
  }

];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class LibRoutingModule { }
