import { Directive, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';

import { ConfigService, LoggerService } from 'serendipity-utils-lib';

import { DialogService } from '../../../services/dialogs/dialog';

@Directive()
export abstract class AbstractComponent {

  public isLoading = signal<boolean>(true);

  protected configService: ConfigService = inject(ConfigService);
  protected dialogService: DialogService = inject(DialogService);
  protected logger: LoggerService = inject(LoggerService);
  protected router: Router = inject(Router);

  private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);

  public handsetPortrait = toSignal(
    this.breakpointObserver.observe([Breakpoints.HandsetPortrait]).pipe(
      map(result => result.matches)
    ),
    { initialValue: false } // Safe fallback startup baseline
  );

  public isHandsetPortrait(): boolean {
    return this.handsetPortrait();
  }

  protected constructor() {}

}



/*

  // protected dialogService: DialogService = inject(DialogService);
  // protected authService: AuthService = inject(AuthService);

  // protected route: ActivatedRoute = inject(ActivatedRoute);
  // protected router: Router = inject(Router);
  // protected snackBar: MatSnackBar = inject(MatSnackBar);

*/
