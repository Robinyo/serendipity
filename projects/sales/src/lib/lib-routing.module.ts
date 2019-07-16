import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//
// Auth libs
//

import { AuthModule, AuthGuard } from 'auth';
import { AuthOktaModule, AuthOktaGuard } from 'auth-okta';

import { CanDeactivateGuard } from './guards/can-deactivate/can-deactivate.guard';

import { ActivitiesComponent } from './components/activities/activities.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ContactComponent } from './components/contact/contact.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [

  {
    path: 'sales/activities',
    component: ActivitiesComponent,
    // canActivate: [AuthOktaGuard],
    // canActivate: [AuthGuard],
    canActivate: [AuthOktaGuard],
    canDeactivate: [CanDeactivateGuard],
    runGuardsAndResolvers: 'always'
  },

  //
  // The Wildcard route
  // See: app-routing.module.ts
  //

  {
    path: 'sales/dashboards',
    component: DashboardComponent,
    // canActivate: [AuthOktaGuard],
    // canActivate: [AuthGuard],
    canActivate: [AuthOktaGuard],
    runGuardsAndResolvers: 'always'
  },

  {
    path: 'sales/contacts',
    component: ContactsComponent,
    // canActivate: [AuthOktaGuard],
    // canActivate: [AuthGuard],
    canActivate: [AuthOktaGuard],
    runGuardsAndResolvers: 'always'
  },

  {
    path: 'sales/contacts/:id',
    component: ContactComponent,
    // canActivate: [AuthOktaGuard],
    // canActivate: [AuthGuard],
    canActivate: [AuthOktaGuard],
    canDeactivate: [CanDeactivateGuard],
    runGuardsAndResolvers: 'always'
  }

];

@NgModule({
  imports: [
    AuthModule,
    AuthOktaModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    AuthOktaGuard
    // { provide: AuthGuard, useClass: AuthOktaGuard }
  ],
  exports: [
    RouterModule
  ]
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
