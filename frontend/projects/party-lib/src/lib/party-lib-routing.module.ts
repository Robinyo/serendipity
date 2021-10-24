import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountComponent } from './components/account/account.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { ContactComponent } from './components/contact/contact.component';
import { ContactsComponent } from './components/contacts/contacts.component';

const routes: Routes = [

  {
    path: 'accounts',
    component: AccountsComponent,
    // canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'accounts/:id',
    component: AccountComponent,
    // canActivate: [AuthGuard],
    // canDeactivate: [CanDeactivateGuard],
    runGuardsAndResolvers: 'always'
  },

  {
    path: 'contacts',
    component: ContactsComponent,
    // canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },

  {
    path: 'contacts/:id',
    component: ContactComponent,
    // canActivate: [AuthGuard],
    // canDeactivate: [CanDeactivateGuard],
    runGuardsAndResolvers: 'always'
  }

  /*
  {
    path: 'contacts/new',
    component: ContactWizardComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  }
  */

];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class PartyLibRoutingModule {}
