import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LeadsComponent } from './components/leads/leads.component';
import { OpportunitiesComponent } from './components/opportunities/opportunities.component';

//
// Auth libs
//

import { AuthGuard } from 'auth';

// import { CanDeactivateGuard } from './guards/can-deactivate/can-deactivate.guard';

//
// As we are lazy loading the Sales module in the App routing module, every route (in this module) is a child route.
//
// {
//   path: 'sales',
//   loadChildren: './lazy-loading/sales-lib-wrapper.module#SalesLibWrapperModule'
// }
//

const routes: Routes = [

  {
    path: 'leads',
    component: LeadsComponent,
    canActivate: [AuthGuard],
    // canDeactivate: [CanDeactivateGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'opportunities',
    component: OpportunitiesComponent,
    canActivate: [AuthGuard],
    // canDeactivate: [CanDeactivateGuard],
    runGuardsAndResolvers: 'always'
  }

];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class LazyLibRoutingModule {}

// https://stackoverflow.com/questions/40380726/angular2-router-canactivate-after-logout

/*

{
  path: 'dashboards',
  loadChildren: './lazy-loading/dashboard-lib-wrapper.module#DashboardLibWrapperModule',
  component: DashboardComponent,
  canActivate: [AuthGuard],
  runGuardsAndResolvers: 'always'
},

*/
