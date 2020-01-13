import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { DynamicFormControlCustomEvent, DynamicFormModel, DynamicFormService } from 'dynamic-forms';
import { ItemComponent, SnackBarComponent } from 'serendipity-components';

import { Account } from '../../models/account';
import { AccountsService } from '../../services/accounts/accounts.service';

import { ACCOUNTS } from '../../models/constants';
import { ACCOUNT_GENERAL_INFORMATION_GROUP } from '../../models/form-ids';

@Component({
  selector: 'sales-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent extends ItemComponent<Account> {

  public generalInformationModel: DynamicFormModel; // DynamicFormControlModel[] = [];
  public generalInformationGroup: FormGroup;

  constructor(route: ActivatedRoute,
              private entityService: AccountsService,
              private dynamicFormService: DynamicFormService) {

    super(route);
  }

  async subscribe() {

    this.logger.info('AccountComponent: subscribe()');

    this.generalInformationModel = await this.dynamicFormService.getFormMetadata(ACCOUNT_GENERAL_INFORMATION_GROUP);
    this.generalInformationGroup = this.dynamicFormService.createGroup(this.generalInformationModel);

    let entitySubscription: Subscription = new Subscription();
    this.subscriptions.push(entitySubscription);

    entitySubscription = this.entityService.findOne(this.id).subscribe(data => {

      this.logger.info('AccountComponent subscribe() data: ' + JSON.stringify(data));

      this.item = data;
      this.dynamicFormService.initGroup(this.generalInformationGroup, this.item);
    });

  }

  //
  // Validation
  //

  public canDeactivate(): Observable<boolean> | boolean {

    // this.logger.info('AccountComponent: canDeactivate()');

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

  public isDirty() {

    // this.logger.info('AccountComponent - isDirty()');

    let dirty = false;

    if ((this.generalInformationGroup && this.generalInformationGroup.dirty)) {
      dirty = true;
    }

    return dirty;
  }

  public isValid() {

    // this.logger.info('AccountComponent - isValid()');

    let valid = false;

    if (this.generalInformationGroup && this.generalInformationGroup.valid) {
      valid = true;
    }

    return valid;
  }

  public markAsPristine() {

    // this.logger.info('AccountComponent - markAsPristine()');

    if (this.generalInformationGroup) {
      this.generalInformationGroup.markAsPristine();
    }

  }

  //
  // Command Bar events
  //

  public onClose() {

    // this.logger.info('AccountComponent: onClose()');

    this.router.navigate([ACCOUNTS]);
  }

  public onCustomEvent(event: DynamicFormControlCustomEvent) {

    this.logger.info('AccountComponent: onCustomEvent()');

    this.dialogService.openAlert({
      title: 'Alert',
      message: JSON.stringify(event),
      closeButton: 'CLOSE'
    });

    // this.logger.info('event: ' + JSON.stringify(event));
  }

  public onDeactivate() {

    this.logger.info('AccountComponent: onDeactivate()');

    this.dialogService.openConfirm({
      title: 'Contact',
      message: 'Are you sure you want to delete this account?',
      acceptButton: 'OK',
      cancelButton: 'CANCEL'
    }).afterClosed().subscribe(response => {

      // this.logger.info(`ContactPage onDeactivate() response: ${response}`);

      if (response) {

        this.logger.info('AccountComponent onDeactivate() response: true');

        // const subscription: Subscription = this.contactsService.delete(this.partyId).subscribe(() => {
        //   subscription.unsubscribe();
        //   this.router.navigate([CONTACTS]);
        // });

      }

    });

  }

  public onNew() {

    this.logger.info('AccountComponent: onNew()');

    this.router.navigate([ACCOUNTS + '/new']);
  }

  public onSave() {

    this.logger.info('AccountComponent: onSave()');

    this.update();
  }

  public onSaveAndClose() {

    this.logger.info('AccountComponent: onSaveAndClose()');

    this.onSave();
    this.onClose();
  }

  //
  // Misc
  //

  private openSnackBar() {

    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: 'Account saved'
      },
      duration: 500,
      panelClass: 'crm-snack-bar'
    });

  }

  private update() {

    this.logger.info('AccountComponent: update()');

    this.markAsPristine();
    // this.openSnackBar();
  }

}
