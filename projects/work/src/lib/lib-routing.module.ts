import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ActivitiesComponent } from './components/activities/activities.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

//
// Auth libs
//

import { AuthGuard } from 'auth';

// import { CanDeactivateGuard } from './guards/can-deactivate/can-deactivate.guard';

const routes: Routes = [

  {
    path: 'work/activities',
    component: ActivitiesComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },

  /*
  {
    path: 'activities/email',
    component: EmailComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'activities/tasks',
    component: TasksComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard],
    runGuardsAndResolvers: 'always'
  },
  */

  {
    path: 'work/dashboards',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  }

];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class LibRoutingModule {}

// https://stackoverflow.com/questions/40380726/angular2-router-canactivate-after-logout
