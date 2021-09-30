import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '@app/home/home.component';

import { PlaceholderComponent } from '@app/core/components/placeholder/placeholder.component';

const routes: Routes = [

  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },

  {
    path: 'work/activities',
    component: PlaceholderComponent,
    // canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },

  {
    path: 'reports',
    component: PlaceholderComponent,
    // canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },

  {
    path: 'not-found',
    component: PlaceholderComponent,
    // canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },

  //
  // The Wildcard route
  // DO NOT insert routes after this one.
  // { path:'**', ...} needs to be the LAST one.
  //

  {
    path: '**',
    redirectTo: 'not-found'
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
export class AppRoutingModule { }
