import { Component, inject, effect, ChangeDetectionStrategy } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelContent, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

import { Observable, of } from 'rxjs';
import { first, tap } from 'rxjs/operators';

import { ActivityBar, CommandBar, AbstractItem } from 'serendipity-components-lib';
import { FormJsWrapper } from 'serendipity-camunda-lib';

import { AbstractPartyItem } from '../../components/abstract/PartyItem';
import { AccountModel, AccountUpdateDto } from '../../models/models';
import { AccountAdapter } from '../../adapters/account';

import { AccountsService } from '../../services/accounts/accounts';

import { ACCOUNTS, Tab } from './constants';

@Component({
  selector: 'account',
  imports: [
    ActivityBar,
    CommandBar,
    FormJsWrapper,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelContent,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
  ],
  templateUrl: './account.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './account.scss'
})
export class Account extends AbstractPartyItem<AccountUpdateDto> {

  private accountsService: AccountsService = inject(AccountsService);

  private adapter: AccountAdapter = inject(AccountAdapter);

  constructor() {

    super();

    this.logger.info('Account Component: constructor()');

    effect(() => {

      const resolvedData = this.metadata();

      this.logger.info(`Switched view viewport target context to Party Id: ${this.id()}`);

      if (resolvedData?.account) {
        this.item = resolvedData.account;
        this.schema = resolvedData.generalInformationFormSchema;
      }

    });

  }

  //
  // Validation
  //

  public canDeactivate(): Observable<boolean> | boolean {

    this.logger.info('Account Component: canClose()');

    if (!this.isDirty() && this.isValid()) {
      return true;
    }

    return this.dialogService.openConfirm({
      title: 'Account',
      message: 'Are you sure you want to leave this page?',
      acceptButton: 'OK',
      cancelButton: 'CANCEL'
    }).afterClosed();

  }

  //
  // Command Bar Handlers
  //

  public onClose(): void {

    this.logger.info('Account Component: onClose()');

    const checkResult = this.canDeactivate();

    // If the check returned a direct primitive boolean (e.g. form is clean), wrap it in an Observable.
    // Otherwise, use the existing dialog afterClosed() stream directly!
    const closingStream$: Observable<boolean> = typeof checkResult === 'boolean'
      ? of(checkResult)
      : checkResult;

    // Subscribe to the stream, grab the first emitted value, and act on it
    closingStream$.pipe(first()).subscribe((shouldNavigate: boolean) => {
      this.logger.info(`Navigation permission evaluated result: ${shouldNavigate}`);

      if (shouldNavigate) {
        // Only route away if the user explicitly clicked 'OK' on the dialog!
        this.router.navigate([ACCOUNTS]);
      }
    });

  }

  public onSave(): void {

    this.logger.info('Account Component: OnSave Click Event Intercepted');

    this.executeSaveTransaction().subscribe({
      next: (result) => {
        if (result) {
          this.logger.info('Account Component: Standalone update lifecycle completely finalized.');
          // Optional: Display a quick, non-blocking toast/snackbar success message here
        }
      }
    });

  }

  public onSaveAndClose(): void {

    this.logger.info('Account Component: OnSaveAndClose Click Event Intercepted');

    this.executeSaveTransaction().subscribe((result) => {
      // Only navigate away if validation passed and server output successfully resolved
      if (result) {
        this.logger.info('Account Component: Save transaction complete. Initiating safe routing exit.');
        this.router.navigate([ACCOUNTS]);
      }
    });

  }

  private executeSaveTransaction(): Observable<AccountModel | null> {

    this.logger.info('Account Component: executeSaveTransaction() compiling direct DTO payload');

    if (!this.form || !this.form.isValid()) {
      this.logger.error('Form submission blocked: Invalid form data constraints.');
      return of(null);
    }

    const rawFormData = this.form.getData();
    this.logger.info('rawFormData: ' + JSON.stringify(rawFormData, null, 2));

    const updateDto = {
      name: rawFormData.name,
      email: rawFormData.email || null,
      phoneNumber: rawFormData.phoneNumber || null,
      faxNumber: rawFormData.faxNumber || null,
      preferredContactMethod: rawFormData.preferredContactMethod || null,
      establishmentDate: rawFormData.establishmentDate || null
    };

    queueMicrotask(() => this.isLoading.set(true));
    this.logger.info('Dispatched Network payload: ' + JSON.stringify(updateDto, null, 2));

    return this.accountsService.update(this.id(), updateDto).pipe(
      tap({
        next: (response: AccountModel) => {
          this.logger.info('Account Component: update() successfully resolved over network pipeline.');

          this.item = this.adapter.adapt(response);

          // Sync our schema-based tracking baseline to mark the canvas pristine
          if (this.form) {
            this.form.resetPristineState(this.item);
          }

          this.isLoading.set(false);
        },
        error: (err) => {
          this.logger.error('Account Component: update execution fault interceptor triggered', err);
          this.isLoading.set(false);
        }
      })
    );
  }

  public onDeactivate(): void {

    this.logger.info('Account Component: onDeactivate()');

    this.dialogService.openConfirm({
      title: 'Delete Account',
      message: 'Are you sure you want to delete this account?',
      acceptButton: 'OK',
      cancelButton: 'CANCEL'
    }).afterClosed().subscribe((confirmed: boolean) => {

      this.logger.info(`Delete validation confirmation response resolved: ${confirmed}`);

      if (confirmed) {

        queueMicrotask(() => this.isLoading.set(true));

        if (!this.form || !this.form.isValid()) {
          this.logger.error('Form submission blocked: Invalid form data.');
          return;
        }

        // Capture today's calendar date in standard ISO format (YYYY-MM-DD)
        const todayIsoString = new Date().toISOString().split('T')[0];

        const softDeleteDto = {
          name: this.item.name,
          email: this.item.email || null,
          phoneNumber: this.item.phoneNumber || null,
          faxNumber: this.item.faxNumber || null,
          preferredContactMethod: this.item.preferredContactMethod || null,
          establishmentDate: this.item.establishmentDate || null,
          toDate: todayIsoString
        };

        this.logger.info('Dispatched Network payload: ' + JSON.stringify(softDeleteDto, null, 2));

        this.accountsService.update(this.id(), softDeleteDto).subscribe({
          next: (response: AccountModel) => {
            this.logger.info('Account Component: update() successfully resolved over network.');
          },
          error: (err) => {
            this.logger.error('Account Component: update execution fault interceptor', err);
          }
        });

      }

    });
  }

  public onNew(): void {
    this.logger.info('Account Component: onNew()');
  }

  public onTabChanged($event: any): void {
    this.logger.info('Account Component: onTabChanged()');
    this.selectedTabIndex = $event.index;
  }

}



/*

private openSnackBar(): void {

  this.snackBar.openFromComponent(SnackBarComponent, {
    data: {
      message: 'Contact saved'
    },
    duration: 500,
    panelClass: 'md-snack-bar'
  });

}

*/
