import { Directive, inject, Input } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from 'serendipity-auth-lib';
import { LoggerService } from 'serendipity-utils-lib';
import { DialogService } from '../../../services/dialogs/dialog';

@Directive()
export abstract class Tab<T> {

  @Input()
  public item!: T;

  protected authService: AuthService = inject(AuthService);
  protected dialogService: DialogService = inject(DialogService);
  protected logger: LoggerService = inject(LoggerService);
  protected snackBar: MatSnackBar = inject(MatSnackBar);

  // protected route: ActivatedRoute = inject(ActivatedRoute);
  // protected router: Router = inject(Router);

  protected constructor() {}

}
