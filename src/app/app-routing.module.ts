import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//
// Auth libs
//

import { AuthGuard } from 'auth';

import { PlaceholderComponent } from '@app/core/components/placeholder/placeholder.component';

const routes: Routes = [

  //
  // https://angular.io/guide/lazy-loading-ngmodules#routes-at-the-app-level
  //

  // ng build --prod --source-map
  //
  // ERROR in ./src/app/app-routing.module.ts
  // Module not found: Error: Can't resolve './../../dist/sales/lib/sales.module.d.ngfactory' in
  //   '/Users/robferguson/workspace/Robinyo/serendipity/src/app'

  // {
  //   path: 'sales',
  //   loadChildren: () => import('sales').then(lib => lib.SalesModule)
  // },

  //
  // Reference the lib wrapper module using a relative path
  //

  {
    path: 'sales',
    loadChildren: './lazy-loading/sales-lib-wrapper.module#SalesLibWrapperModule'
  },

  /*

  {
    // path: 'sales/leads',
    path: 'leads',
    component: PlaceholderComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },

  {
    // path: 'sales/leads',
    path: 'leads',
    loadChildren: './lazy-loading/dashboard-lib-wrapper.module#DashboardLibWrapperModule',
    component: PlaceholderComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },

  */

  {
    // path: 'sales/accounts',
    path: 'accounts',
    component: PlaceholderComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },

  {
    // path: 'sales/leads',
    path: 'leads',
    component: PlaceholderComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },

  {
    // path: 'sales/opportunities',
    path: 'opportunities',
    component: PlaceholderComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },

  //
  // The Wildcard route
  //

  {
    path: '**',
    redirectTo: 'accounts'
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}

// https://github.com/tomastrajan/angular-lazy-lib-demo/blob/master/projects/some-app/src/app/app-routing.module.ts

// https://stackoverflow.com/questions/40380726/angular2-router-canactivate-after-logout
