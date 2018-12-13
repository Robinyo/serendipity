import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlaceholderComponent } from '@app/core/components/placeholder/placeholder.component';

import { ContactsComponent } from 'sales';
import { ContactComponent } from 'sales';
import { DashboardComponent } from 'sales';

const routes: Routes = [

  {
    path: 'sales/dashboards',
    component: DashboardComponent
  },
  {
    path: 'sales/accounts',
    component: PlaceholderComponent
  },
  {
    path: 'sales/contacts',
    component: ContactsComponent
  },
  {
    path: 'sales/contacts/:id',
    component: ContactComponent
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

// import { MyDashboardComponent } from '@app/shared/components/samples/my-dashboard/my-dashboard.component';
// import { MyTableComponent } from '@app/shared/components/samples/my-table/my-table.component';

// import { AccountsComponent } from 'sales';

/*

  {
    path: 'sales/activities',
    component: PlaceholderComponent
  },

  {
    path: 'sales/dashboards',
    component: MyDashboardComponent
  },

*/
