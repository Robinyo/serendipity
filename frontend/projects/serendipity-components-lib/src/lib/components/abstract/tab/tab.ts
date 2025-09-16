import { Directive, inject, Input } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import { LoggerService } from 'serendipity-utils-lib';

import { DialogService } from '../../../services/dialogs/dialog';

@Directive()
export abstract class Tab<T> {

  @Input()
  public item!: T;

  protected dialogService: DialogService = inject(DialogService);
  protected logger: LoggerService = inject(LoggerService);
  protected snackBar: MatSnackBar = inject(MatSnackBar);

  protected constructor() {}

}
