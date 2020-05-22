import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlaceholderComponent } from '@app/core/components/placeholder/placeholder.component';
import { ProfileComponent } from '@app/core/components/profile/profile.component';

//
// Auth libs
//

import { AuthGuard } from 'auth';

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
  // Reference the lib wrapper modules using a relative path
  //

  {
    path: 'sales',
    children: [
      {
        path: '',
        loadChildren: () => import('./lazy-loading/sales-lib-wrapper.module').then(m => m.SalesLibWrapperModule)
      }
    ]
  },

  {
    path: 'users/profile',
    component: ProfileComponent,
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
    redirectTo: 'leads'
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

// https://github.com/angular/angular/issues/10981

// https://github.com/tomastrajan/angular-lazy-lib-demo/blob/master/projects/some-app/src/app/app-routing.module.ts

// https://stackoverflow.com/questions/40380726/angular2-router-canactivate-after-logout

/*

  {
    // path: 'sales/accounts',
    path: 'accounts',
    component: PlaceholderComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },


{
  path: '',
  loadChildren: './lazy-loading/dashboard-widgets-lib-wrapper.module#DashboardWidgetsLibWrapperModule'
},
{
  path: '',
  loadChildren: './lazy-loading/dashboard-lib-wrapper.module#DashboardLibWrapperModule'
},

*/

/*

  {
    path: 'sales',
    children: [
      {
        path: '',
        loadChildren: './lazy-loading/flowable-lib-wrapper.module#FlowableLibWrapperModule'
      },
      {
        path: '',
        loadChildren: './lazy-loading/dashboard-widgets-lib-wrapper.module#DashboardWidgetsLibWrapperModule'
      },
      {
        path: '',
        loadChildren: './lazy-loading/dashboard-lib-wrapper.module#DashboardLibWrapperModule'
      },
      {
        path: '',
        loadChildren: './lazy-loading/sales-lib-wrapper.module#SalesLibWrapperModule'
      }
    ]
  },

*/

/*

      {
        path: '',
        loadChildren: './lazy-loading/highcharts-lib-wrapper.module#HighchartsLibWrapperModule'
      },

  {
    path: 'sales',
    children: [
      {
        path: '',
        loadChildren: './lazy-loading/sales-lib-wrapper.module#SalesLibWrapperModule'
      },
      {
        path: '',
        loadChildren: './lazy-loading/dashboard-lib-wrapper.module#DashboardLibWrapperModule'
      },
      {
        path: '',
        loadChildren: './lazy-loading/dashboard-widgets-lib-wrapper.module#DashboardWidgetsLibWrapperModule'
      },
      {
        path: '',
        loadChildren: './lazy-loading/dynamic-forms-lib-wrapper.module#DynamicFormsLibWrapperModule'
      }

    ]
  },

*/

/*

{
  path: 'sales',
  children: [
    {
      path: '',
      loadChildren: './lazy-loading/sales-lib-wrapper.module#SalesLibWrapperModule'
    },
    {
      path: 'library-dashboard',
      loadChildren: './lazy-loading/dashboard-lib-wrapper.module#DashboardLibWrapperModule'
    },
    {
      path: 'library-dashboard-widgets',
      loadChildren: './lazy-loading/dashboard-widgets-lib-wrapper.module#DashboardWidgetsLibWrapperModule'
    },
    {
      path: 'library-dynamic-forms',
      loadChildren: './lazy-loading/dynamic-forms-lib-wrapper.module#DynamicFormsLibWrapperModule'
    }

  ]
},

{
  path: 'sales',
  loadChildren: './lazy-loading/sales-lib-wrapper.module#SalesLibWrapperModule'
},

{
  path: 'sales',
  loadChildren: './lazy-loading/sales-lib-wrapper.module#SalesLibWrapperModule',
  children: [
    {
      path: 'library-1',
      loadChildren: './lazy-loading/dashboard-lib-wrapper.module#DashboardLibWrapperModule'
    }
  ]
},

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
