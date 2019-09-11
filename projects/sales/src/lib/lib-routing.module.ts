import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ActivitiesComponent } from './components/activities/activities.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ContactComponent } from './components/contact/contact.component';
import { ContactWizardComponent } from './components/contact-wizard/contact-wizard.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

//
// Auth libs
//

import { AuthGuard } from 'auth';

import { CanDeactivateGuard } from './guards/can-deactivate/can-deactivate.guard';

//
// As we are lazy loading the Sales module in the App routing module, every route (in this module) is a child route.
//
//   {
//     path: 'sales',
//     loadChildren: () => import('sales').then(lib => lib.SalesModule)
//   },
//

const routes: Routes = [

  {
    // path: 'sales/activities',
    path: 'activities',
    component: ActivitiesComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard],
    runGuardsAndResolvers: 'always'
  },

  {
    // path: 'sales/dashboards',
    path: 'dashboards',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },

  {
    // path: 'sales/contacts',
    path: 'contacts',
    component: ContactsComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },

  {
    // path: 'sales/contacts/new',
    path: 'contacts/new',
    component: ContactWizardComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },

  {
    // path: 'sales/contacts/:id',
    path: 'contacts/:id',
    component: ContactComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard],
    runGuardsAndResolvers: 'always'
  }

];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class LibRoutingModule {}

// https://stackoverflow.com/questions/40380726/angular2-router-canactivate-after-logout
