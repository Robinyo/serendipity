import { Directive, inject } from '@angular/core';

import { AuthService } from 'serendipity-auth-lib';
import { DialogService } from '../../../services/dialogs/dialog';

import { AbstractComponent } from '../component/component';

const noop = (): any => undefined;

@Directive()
export abstract class Composite extends AbstractComponent {

  protected authService: AuthService = inject(AuthService);
  protected dialogService: DialogService = inject(DialogService);
  // protected route: ActivatedRoute = inject(ActivatedRoute);
  // protected router: Router = inject(Router);
  // protected snackBar: MatSnackBar = inject(MatSnackBar);

  protected subscribe() {}

}
