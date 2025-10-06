import { Directive, inject } from '@angular/core';

import { AuthService } from 'serendipity-auth-lib';
import { DialogService } from '../../../services/dialogs/dialog';

import { AbstractComponent } from '../component/component';

const noop = (): any => undefined;

@Directive()
export abstract class List<T> extends AbstractComponent {

  public items!: Array<T>;
  public selectedItem!: T;

  protected authService: AuthService = inject(AuthService);
  protected dialogService: DialogService = inject(DialogService);
  // protected route: ActivatedRoute = inject(ActivatedRoute);
  // protected router: Router = inject(Router);
  // protected snackBar: MatSnackBar = inject(MatSnackBar);

  //
  // Command events
  //

  public onSelect(item: T): void {
    this.selectedItem = item;
  }

}
