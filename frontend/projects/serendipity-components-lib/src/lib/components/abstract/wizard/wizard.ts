import { AfterViewInit, Directive, inject, Injector, OnInit, Type } from '@angular/core';

import { Observable } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { LoggerService } from 'serendipity-utils-lib';

import { DialogService } from '../../../services/dialogs/dialog';

@Directive()
export abstract class WizardComponent<T> implements OnInit, AfterViewInit {

  public item!: T;

  protected breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  protected dialogService: DialogService = inject(DialogService);
  protected logger: LoggerService = inject(LoggerService);
  protected snackBar: MatSnackBar = inject(MatSnackBar);

  protected handsetPortrait: boolean = false;

  protected constructor() {}

  public ngOnInit() {

    this.logger.info('WizardComponent: ngOnInit()');

  }

  protected abstract createSteps(): void;

  public ngAfterViewInit() {

    this.logger.info('WizardComponent: ngAfterViewInit()');

    this.createSteps();

    // React to changes to the viewport

    this.breakpointObserver.observe([ Breakpoints.HandsetPortrait ]).subscribe(result => {
      this.handsetPortrait = result.matches;
    });

  }

  //
  // Validation
  //

  public abstract canDeactivate(): Observable<boolean> | boolean ;
  public abstract isDirty(): boolean;
  public abstract isValid(): boolean;
  public abstract markAsPristine(): void;

  //
  // Misc
  //

  public isHandsetPortrait() {
    return this.handsetPortrait;
  }

}
