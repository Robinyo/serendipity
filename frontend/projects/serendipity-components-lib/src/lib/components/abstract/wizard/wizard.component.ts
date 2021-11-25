import { AfterViewInit, Directive, Injector, OnInit, Type } from '@angular/core';

import { Observable } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { LoggerService, StaticInjectorService } from 'utils-lib';

import { DialogService } from '../../../services/dialogs/dialog.service';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class WizardComponent<T> implements OnInit, AfterViewInit {

  public item!: T;

  protected breakpointObserver: BreakpointObserver;
  protected dialogService: DialogService;
  protected logger: LoggerService;
  protected snackBar: MatSnackBar;

  protected handsetPortrait: boolean = false;

  constructor() {

    const injector: Injector = StaticInjectorService.getInjector();

    this.breakpointObserver = injector.get<BreakpointObserver>(BreakpointObserver as Type<BreakpointObserver>);
    this.dialogService = injector.get<DialogService>(DialogService as Type<DialogService>);
    this.logger = injector.get<LoggerService>(LoggerService as Type<LoggerService>);
    this.snackBar = injector.get<MatSnackBar>(MatSnackBar as Type<MatSnackBar>);

  }

  public ngOnInit() {

    this.logger.info('WizardComponent: ngOnInit()');

    this.createSteps();
  }

  protected abstract createSteps(): void;

  public ngAfterViewInit() {

    this.logger.info('WizardComponent: ngAfterViewInit()');

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
