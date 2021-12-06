import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { DynamicFormControlCustomEvent, DynamicFormModel, DynamicFormService } from 'dynamic-forms-lib';
import { ItemComponent, SnackBarComponent } from 'serendipity-components-lib';

import { Account } from '../../models/account';
import { AccountsService } from '../../services/accounts/accounts.service';

import { ACCOUNT_WIZARD, ACCOUNTS } from '../../models/constants';
import { ACCOUNT_ADDRESS_INFORMATION_GROUP, ACCOUNT_GENERAL_INFORMATION_GROUP } from '../../models/form-ids';

@Component({
  selector: 'party-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent extends ItemComponent<Account> {

  public generalInformationModel!: DynamicFormModel;
  public generalInformationGroup!: FormGroup;

  public addressInformationModel!: DynamicFormModel;
  public addressInformationGroup!: FormGroup;

  constructor(route: ActivatedRoute,
              private entityService: AccountsService,
              private dynamicFormService: DynamicFormService) {

    super(route);
  }

  async subscribe() {

    this.logger.info('AccountComponent: subscribe()');

    this.generalInformationModel = await this.dynamicFormService.getFormMetadata(ACCOUNT_GENERAL_INFORMATION_GROUP);
    this.generalInformationGroup = this.dynamicFormService.createGroup(this.generalInformationModel);

    this.addressInformationModel = await this.dynamicFormService.getFormMetadata(ACCOUNT_ADDRESS_INFORMATION_GROUP);
    this.addressInformationGroup = this.dynamicFormService.createGroup(this.addressInformationModel);

    let entitySubscription: Subscription = new Subscription();
    this.subscriptions.push(entitySubscription);

    entitySubscription = this.entityService.findOne(this.id).subscribe(data => {

      this.item = data;

      this.logger.info('item: ' + JSON.stringify(this.item, null, 2));

      this.dynamicFormService.initGroup(this.generalInformationGroup, this.item);
      this.dynamicFormService.initGroup(this.addressInformationGroup, this.item.party.addresses[0]);
    });

  }

  //
  // Validation
  //

  public canDeactivate(): Observable<boolean> | boolean {

    this.logger.info('AccountComponent: canDeactivate()');

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

    let dirty = false;

    if ((this.generalInformationGroup && this.generalInformationGroup.dirty) ||
      (this.addressInformationGroup && this.addressInformationGroup.dirty)) {
      dirty = true;
    }

    // this.logger.info('ContactComponent - isDirty(): ' + dirty);

    return dirty;
  }

  public isValid() {

    let valid = false;

    if (this.generalInformationGroup) {

      valid = true;

      const controls = this.generalInformationGroup.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          this.logger.info('generalInformationGroup ' + name + ' is invalid');
          valid = false;
        }
      }

    }

    if (valid && this.addressInformationGroup) {

      valid = true;

      const controls = this.addressInformationGroup.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          this.logger.info('addressInformationGroup ' + name + ' is invalid');
          valid = false;
        }
      }

    }

    // this.logger.info('ContactComponent - isValid(): ' + valid);

    return valid;
  }

  public markAsDirty() {

    // this.logger.info('ContactComponent: markAsDirty()');

    if (this.generalInformationGroup) {
      this.generalInformationGroup.markAsDirty();
    }

    if (this.addressInformationGroup) {
      this.addressInformationGroup.markAsDirty();
    }

  }

  public markAsPristine() {

    // this.logger.info('AccountComponent - markAsPristine()');

    if (this.generalInformationGroup) {
      this.generalInformationGroup.markAsPristine();
    }

    if (this.addressInformationGroup) {
      this.addressInformationGroup.markAsPristine();
    }

  }

  //
  // Command Bar events
  //

  public onClose() {

    // this.logger.info('AccountComponent: onClose()');

    this.router.navigate([ACCOUNTS]);
  }

  //
  // Dynamic Form events
  //

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
        //
        //   subscription.unsubscribe();
        //   this.router.navigate([ACCOUNTS]);
        // });

      }

    });

  }

  public onNew() {

    this.logger.info('AccountComponent: onNew()');

    this.router.navigate([ACCOUNT_WIZARD]);
  }

  public onSave() {

    this.logger.info('AccountComponent: onSave()');

    this.dynamicFormService.value(this.generalInformationGroup, this.item);
    this.dynamicFormService.value(this.addressInformationGroup, this.item.party.addresses[0]);

    // this.logger.info('contact: ' + JSON.stringify(this.item, null, 2) + '\n');

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
      panelClass: 'md-snack-bar'
    });

  }

  private update() {

    this.logger.info('AccountComponent: update()');

    this.item.id = this.id;

    this.logger.info('item: ' + JSON.stringify(this.item, null, 2) + '\n');

    const subscription: Subscription = this.entityService.update(this.id, this.item).subscribe(() => {

      this.markAsPristine();
      this.openSnackBar();

      subscription.unsubscribe();

    });

  }
}
