import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'auth-lib';

// import { CanDeactivateGuard } from './guards/can-deactivate/can-deactivate.guard';

import { ActivitiesComponent } from './components/activities/activities.component';
import { TasksComponent } from './components/tasks/tasks.component';

const routes: Routes = [

  {
    path: 'work/activities',
    component: ActivitiesComponent,
    canActivate: [AuthGuard],
    // canDeactivate: [CanDeactivateGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'work/activities/:id',
    component: TasksComponent,
    canActivate: [AuthGuard],
    // canDeactivate: [CanDeactivateGuard],
    runGuardsAndResolvers: 'always'
  }

];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class WorkLibRoutingModule {}
