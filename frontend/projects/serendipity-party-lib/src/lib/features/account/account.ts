import { Component, inject, effect, ChangeDetectionStrategy } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelContent, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

import { of, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

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

          // type
          // legalEntityType

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

  public onSave(): void {

    this.logger.info('Account Component: onSave() using direct DTO mapping');

    if (!this.form || !this.form.isValid()) {
      this.logger.error('Form submission blocked: Invalid form data.');
      return;
    }

    const rawFormData = this.form.getData();

    this.logger.info('rawFormData: ' + JSON.stringify(rawFormData, null, 2));

    const updateDto = {

      // type
      // legalEntityType

      name: rawFormData.name,
      email: rawFormData.email || null,
      phoneNumber: rawFormData.phoneNumber || null,
      faxNumber: rawFormData.faxNumber || null,
      preferredContactMethod: rawFormData.preferredContactMethod || null,
      establishmentDate: rawFormData.establishmentDate || null

    };

    this.logger.info('Dispatched Network payload: ' + JSON.stringify(updateDto, null, 2));

    this.accountsService.update(this.id(), updateDto).subscribe({
      next: (response: AccountModel) => {

        this.logger.info('Account Component: update() successfully resolved over network.');

        this.item = this.adapter.adapt(response);

        if (this.form) {
          this.form.resetPristineState(this.item);
        }

      },
      error: (err) => {
        this.logger.error('Account Component: update execution fault interceptor', err);
      }
    });

  }

  public onSaveAndClose(): void {
    this.logger.info('Account Component: onSaveAndClose()');
    this.onSave();
    this.onClose();
  }

  public onTabChanged($event: any): void {
    this.logger.info('Account Component: onTabChanged()');
    this.selectedTabIndex = $event.index;
  }

}


/*

address: rawFormData.address ? {
  name: rawFormData.address.name,
  line1: rawFormData.address.line1,
  line2: rawFormData.address.line2,
  city: rawFormData.address.city,
  state: rawFormData.address.state,
  postalCode: rawFormData.address.postalCode,
  country: rawFormData.address.country,
  addressType: rawFormData.address.addressType || 'Mailing'
} : undefined

*/


/*

  protected subscribe() {

    this.logger.info('Account Component: subscribe()');

    this.isLoading = true;

    const entitySubscription: Subscription = this.accountsService.findById(this.id).subscribe(

      (response: any) => {

        this.logger.info('Account Component: subscribe() success handler');

        this.item = response;

        // this.logger.info('id: ' + this.id + ' item id: ' + this.item.id);
        // this.logger.info('item: ' + JSON.stringify(this.item, null, 2));

        this.isLoading = false;

        this.detectChanges();

      });

    this.subscriptions.push(entitySubscription);

  }

  //
  // Validation
  //

  public canDeactivate(): Observable<boolean> | boolean {

    this.logger.info('Account Component: canDeactivate()');

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

  public isDirty(): boolean {

    this.logger.info('Account Component: isDirty()');

    let dirty = false;

    if (this.form) {
      dirty = this.form.isDirty();
    }

    this.logger.info('dirty === ' + dirty);

    return dirty;

  }

  public isValid() {

    this.logger.info('Account Component: isValid()');

    let valid = false;

    if (this.form) {
      valid = this.form.isValid();
    }

    this.logger.info('valid === ' + valid);

    return valid;

  }

  //
  // Command Bar events
  //

  public onClose() {

    this.logger.info('Account Component: onClose()');

    this.router.navigate([ACCOUNTS]);
  }

  public onDeactivate() {

    this.logger.info('Contact Component: onDeactivate()');

    this.dialogService.openConfirm({
      title: 'Contact',
      message: 'Are you sure you want to delete this account?',
      acceptButton: 'OK',
      cancelButton: 'CANCEL'
    }).afterClosed().subscribe(response => {

      // this.logger.info(`Account Component onDeactivate() response: ${response}`);

      if (response) {

        this.logger.info('Contact Component onDeactivate() response: true');

        const subscription: Subscription = this.accountsService.delete(this.id).subscribe(() => {

          subscription.unsubscribe();
          this.router.navigate([ACCOUNTS]);

        });

      }

    });

  }

  public onNew() {

    this.logger.info('Account Component: onNew()');

    // this.router.navigate([ACCOUNT_WIZARD]);
  }

  public onSave() {

    this.logger.info('Account Component: onSave()');

    const rawFormData = this.form.getData();

    this.logger.info('rawFormData: ' + JSON.stringify(rawFormData, null, 2) + '\n');

    this.logger.info('dto: ' + JSON.stringify(this.item, null, 2) + '\n');

    // Copy your original DTO reference so you don't mutate state unexpectedly
    const updatedDto = JSON.parse(JSON.stringify(this.item));

    // Patch the DTO using the recursive mapper
    this.patchDtoWithFormData(updatedDto, rawFormData);

    // Safely deletes the address property, since it is optional
    delete updatedDto.address;

    // this.logger.info('updatedDto: ' + JSON.stringify(updatedDto, null, 2) + '\n');

    this.update(updatedDto);
  }

  public onSaveAndClose() {

    this.logger.info('Account Component: onSaveAndClose()');

    this.onSave();
    this.onClose();
  }

  //
  // Dynamic Form events
  //

  public onCustomEvent(event: any) {

    this.logger.info('Account Component: onCustomEvent()');

  }

  private update(dto: any): void {

    this.logger.info('Account Component: update()');

    this.item = dto;
    // this.item.id = this.id;

    this.logger.info('id: ' + this.id + ' item id: ' + this.item.id);
    this.logger.info('item: ' + JSON.stringify(this.item, null, 2) + '\n');

    const subscription: Subscription = this.accountsService.update(this.id, this.item).subscribe(() => {

      // this.openSnackBar();

      subscription.unsubscribe();

    });

  }

  //
  // Misc events
  //

  public onTabChanged($event: any) {

    this.logger.info('Account omponent: onTabChanged()');

    this.selectedTabIndex = $event.index;

    this.logger.info('selectedTabIndex: ' + this.selectedTabIndex);

  }

  //
  // Misc
  //

public patchDtoWithFormData(dto: any, formData: any): any {

  this.logger.info('Contact Component: patchDtoWithFormData()');

  if (!dto || !formData || typeof dto !== 'object' || typeof formData !== 'object') {
    return dto;
  }

  // 1. Explicitly handle the 'address' mapping to 'party.addresses' array
  if (formData.address && dto.party && Array.isArray(dto.party.addresses)) {
    const formAddress = formData.address;

    // Find the existing address entry in the DTO matching the form's address type
    const matchingDtoAddress = dto.party.addresses.find(
      (addr: any) => addr.addressType === formAddress.addressType
    );

    if (matchingDtoAddress) {
      // Recursively patch the found address so we don't drop fields like 'id' or 'location'
      this.patchDtoWithFormData(matchingDtoAddress, formAddress);
    } else {
      // Optional fallback: If the type wasn't found in the array, add it as a new entry
      // dto.party.addresses.push({ ...formAddress });
      this.logger.error('Contact Component: addressType not found');
    }
  }

  // 2. Fall back to standard recursive key matching for the rest of the object graph
  Object.keys(formData).forEach(key => {

    // Skip manual processing of the 'address' key here since we handled it above
    if (key === 'address') return;

    if (key in dto) {
      const formValue = formData[key];
      const dtoValue = dto[key];

      if (
        formValue && typeof formValue === 'object' && !Array.isArray(formValue) &&
        dtoValue && typeof dtoValue === 'object' && !Array.isArray(dtoValue)
      ) {
        this.patchDtoWithFormData(dtoValue, formValue);
      } else {
        dto[key] = formValue;
      }
    }
  });

  return dto;
}


*/

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

/**
 * Recursively updates fields in the target DTO with matching values from the form data.
 * Explicitly maps a flat form 'address' object to a matching entry in the DTO's 'party.addresses' array.
 *
 * @param dto The original target DTO object
 * @param formData The data snapshot extracted from the form
 * @returns The patched DTO object
 */
