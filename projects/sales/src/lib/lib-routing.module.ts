import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'auth';

import { ActivitiesComponent } from './components/activities/activities.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ContactComponent } from './components/contact/contact.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [

  {
    path: 'sales/activities',
    component: ActivitiesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sales/dashboards',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },

  //
  // The Wildcard route
  // See: app-routing.module.ts
  //

  {
    path: 'sales/contacts',
    component: ContactsComponent,
    canActivate: [AuthGuard]
    // runGuardsAndResolvers: 'always'
  },

  {
    path: 'sales/contacts/:id',
    component: ContactComponent,
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class LibRoutingModule {}

// https://stackoverflow.com/questions/40380726/angular2-router-canactivate-after-logout

/*

import { CanActivateGuard } from './guards/can-activate/can-activate.guard';
import { CanDeactivateGuard } from './guards/can-deactivate/can-deactivate.guard';

  {
    path: 'sales/activities',
    component: ActivitiesComponent,
    canActivate: [CanActivateGuard],
    canDeactivate: [CanDeactivateGuard]
  }


*/
