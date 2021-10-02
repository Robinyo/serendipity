import { loadRemoteEntry } from '@angular-architects/module-federation';

Promise.all([

  //
  // See: app-routing.module.ts
  //

  loadRemoteEntry('http://localhost:4201/remoteEntry.js', 'party')

])
  .catch(err => console.error('Error loading remote entries', err))
  .then(() => import('./bootstrap'))
  .catch(err => console.error(err));

// https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/tutorial/tutorial.md
