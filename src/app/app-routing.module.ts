import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, OktaLoginComponent } from 'auth';

import { PlaceholderComponent } from '@app/core/components/placeholder/placeholder.component';

const routes: Routes = [

  {
    path: 'login',
    component: OktaLoginComponent
  },
  {
    path: 'sales/accounts',
    component: PlaceholderComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'sales/leads',
    component: PlaceholderComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'sales/opportunities',
    component: PlaceholderComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },

  //
  // The Wildcard route
  //

  {
    path: '**',
    redirectTo: 'sales/dashboards'
  }

];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

// https://stackoverflow.com/questions/40380726/angular2-router-canactivate-after-logout

// import { MyDashboardComponent } from '@app/shared/components/samples/my-dashboard/my-dashboard.component';
// import { MyTableComponent } from '@app/shared/components/samples/my-table/my-table.component';

// import { AccountsComponent } from 'sales';

/*

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

*/

/*

const routes: Routes = [

  {
    path: 'sales/accounts',
    component: PlaceholderComponent
  },
  {
    path: 'sales/leads',
    component: PlaceholderComponent
  },
  {
    path: 'sales/opportunities',
    component: PlaceholderComponent
  },

  {
    path: '',
    redirectTo: 'sales/dashboards',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PlaceholderComponent
  }

];

*/
