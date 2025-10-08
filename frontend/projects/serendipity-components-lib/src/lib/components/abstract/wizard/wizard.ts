import { Directive, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Breakpoints } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';

import { takeUntil } from 'rxjs/operators';

import { AuthService } from 'serendipity-auth-lib';

import { AbstractComponent } from '../component/component';
import { DialogService } from '../../../services/dialogs/dialog';

@Directive()
export abstract class WizardComponent<T> extends AbstractComponent {

  public item!: T;

  protected authService: AuthService = inject(AuthService);
  protected dialogService: DialogService = inject(DialogService);
  protected route: ActivatedRoute = inject(ActivatedRoute);
  protected router: Router = inject(Router);
  protected snackBar: MatSnackBar = inject(MatSnackBar);

  protected abstract createSteps(): void;

  override subscribe() {

    this.logger.info('Wizard Component: subscribe()');

  }

  override unsubscribe(): void {

    this.logger.info('Wizard Component: unsubscribe()');

  }

  override ngAfterViewInit() {

    this.logger.info('Wizard Component: ngAfterViewInit()');

    this.createSteps();

    // A layout breakpoint is viewport size threshold at which a layout shift can occur.
    // The viewport size ranges between breakpoints correspond to different standard screen sizes.
    // See: https://material.angular.dev/cdk/layout/overview

    this.breakpointObserver.observe([ Breakpoints.HandsetPortrait ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {

        this.handsetPortrait = result.matches;
        this.detectChanges();

      });

  }

}
