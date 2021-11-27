import {Directive, Injector, Input, Type} from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import { LoggerService, StaticInjectorService } from 'utils-lib';

import { DialogService } from '../../../services/dialogs/dialog.service';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class TabComponent<T> {

  @Input()
  public item!: T;

  protected dialogService: DialogService;
  protected logger: LoggerService;
  protected snackBar: MatSnackBar;

  constructor() {

    const injector: Injector = StaticInjectorService.getInjector();

    this.dialogService = injector.get<DialogService>(DialogService as Type<DialogService>);
    this.logger = injector.get<LoggerService>(LoggerService as Type<LoggerService>);
    this.snackBar = injector.get<MatSnackBar>(MatSnackBar as Type<MatSnackBar>);

  }

}
