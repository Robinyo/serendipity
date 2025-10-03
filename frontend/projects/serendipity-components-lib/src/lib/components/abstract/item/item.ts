import { Directive, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Subscription } from 'rxjs';

import { AuthService } from 'serendipity-auth-lib';
import { DialogService } from '../../../services/dialogs/dialog';

import { AbstractComponent } from '../component/component';

@Directive()
export abstract class Item<T> extends AbstractComponent {

  public id!: string;
  public item!: T;

  protected authService: AuthService = inject(AuthService);
  protected dialogService: DialogService = inject(DialogService);
  protected route: ActivatedRoute = inject(ActivatedRoute);
  protected router: Router = inject(Router);
  protected snackBar: MatSnackBar = inject(MatSnackBar);

  public ngOnInit() {

    this.logger.info('Item Component: ngOnInit()');

    let paramSubscription: Subscription = new Subscription();
    this.subscriptions.push(paramSubscription);

    paramSubscription = this.route.paramMap.subscribe(params =>  {

      const identity = params.get('id');

      if (identity != null) {
        this.id = atob(identity);
      }

      this.logger.info('id: ' + this.id);

    });

  }

}
