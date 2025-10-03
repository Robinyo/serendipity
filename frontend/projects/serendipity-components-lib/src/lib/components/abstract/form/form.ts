import { Directive, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthService } from 'serendipity-auth-lib';

import { AbstractComponent } from '../component/component';

const noop = (): any => undefined;

@Directive()
export abstract class Form extends AbstractComponent {

  protected authService: AuthService = inject(AuthService);
  // protected dialogService: DialogService = inject(DialogService);
  // protected route: ActivatedRoute = inject(ActivatedRoute);
  // protected router: Router = inject(Router);
  // protected snackBar: MatSnackBar = inject(MatSnackBar);

  //
  // Validation
  //

  public abstract canDeactivate(): Observable<boolean> | boolean ;
  public abstract isDirty(): boolean;
  public abstract isValid(): boolean;
  public abstract markAsPristine(): void;

}
