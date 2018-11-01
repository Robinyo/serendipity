import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlaceholderComponent } from '@app/core/components/placeholder/placeholder.component';

import { MyDashboardComponent } from '@app/shared/components/samples/my-dashboard/my-dashboard.component';
// import { MyTableComponent } from '@app/shared/components/samples/my-table/my-table.component';

import { ContactsComponent } from 'sales';
import { AccountsComponent } from 'sales';

import { IndividualComponent } from 'sales';

const routes: Routes = [
  {
    path: 'sales/activities',
    component: PlaceholderComponent
  },
  {
    path: 'sales/dashboards',
    component: MyDashboardComponent
  },
  {
    path: 'sales/accounts',
    component: AccountsComponent
  },
  {
    path: 'sales/contacts',
    component: ContactsComponent
  },
  {
    path: 'sales/contacts/:id',
    component: IndividualComponent
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
