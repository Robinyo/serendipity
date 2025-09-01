import { Routes } from '@angular/router';

import { Home } from './features/home/home';
import { Placeholder } from './features/placeholder/placeholder';

export const routes: Routes = [

  { path: '',
    component: Home
  },

  {
    path: 'work/activities',
    component: Placeholder,
  },

  {
    path: 'customers/dashboards',
    component: Placeholder,
  }

];
