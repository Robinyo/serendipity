import { Component, input } from '@angular/core';

import { AbstractComponent } from './component';

@Component({
  template: '' // Abstract container shell marker
})
export abstract class AbstractItem<T> extends AbstractComponent {

  // ⚡ THE MODERN AUTOMATED BINDING:
  // Because your route path is 'contacts/:id', Angular automatically binds the URL value
  // straight into this input signal! No subscriptions, no lifecycle hooks, no memory leaks.
  public id = input.required<string>();

}



/*

  // Optional: Maintain a plain JavaScript getter if legacy code requires it
  public get publicId(): string {
    return this.id();
  }

*/


/*

import { Directive, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Subscription } from 'rxjs';

import { AUTH_SERVICE_TOKEN, AuthService } from 'serendipity-auth-lib';

// import { DialogService } from '../../../services/dialogs/dialog';
// import { AbstractComponent } from '../component/component';
import { DialogService, AbstractComponent } from 'serendipity-components-lib';

@Directive()
export abstract class Item<T> extends AbstractComponent {

  public id!: string;
  public item!: T;

  protected authService: AuthService = inject(AUTH_SERVICE_TOKEN);
  protected dialogService: DialogService = inject(DialogService);
  protected route: ActivatedRoute = inject(ActivatedRoute);
  protected router: Router = inject(Router);
  protected snackBar: MatSnackBar = inject(MatSnackBar);

  public ngOnInit() {

    this.logger.info('Item Component: ngOnInit()');

    const subscription: Subscription = this.route.paramMap.subscribe(params =>  {

      const identity = params.get('id');

      if (identity != null) {
        this.id = identity;
      }

      this.logger.info('id: ' + this.id);

    });

    this.subscriptions.push(subscription);

  }

}

*/
