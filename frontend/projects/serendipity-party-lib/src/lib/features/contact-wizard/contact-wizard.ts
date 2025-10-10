import { Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';

import { Observable, Subscription } from 'rxjs';

import { ActivityBar, CommandBar, Item, SnackBar, WizardComponent } from 'serendipity-components-lib';
import { DynamicForm, DynamicFormControlCustomEvent, DynamicFormModel, DynamicFormService } from 'serendipity-dynamic-forms-lib';

import { ContactsService } from '../../services/contacts/contacts';
// import { LookupAccountDialogComponent } from "../dialogs/lookup-account-dialog/lookup-account-dialog.component";

// import { AccountModel } from '../../models/account';
// import { DialogResult } from "../../models/dialog";
// import { RoleModel } from '../../models/role';

import { AddressModel } from '../../models/address';
import { ContactModel } from '../../models/contact';
import { LocationModel } from '../../models/location';
import { NameModel } from '../../models/name';
import { PartyModel } from '../../models/party';

import { LocationType } from '../../types/location-type';
import { PartyType } from '../../types/party-type';

import { CONTACTS } from  './constants';

@Component({
  selector: 'contact-wizard',
  imports: [
    ActivityBar,
    CommandBar,
    DynamicForm,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatTabsModule
  ],
  templateUrl: './contact-wizard.html',
  standalone: true,
  styleUrl: './contact-wizard.scss'
})
export class ContactWizard extends WizardComponent<ContactModel> {

  public nameFormModel!: DynamicFormModel;
  public nameFormGroup!: FormGroup;

  public addressFormModel!: DynamicFormModel;
  public addressFormGroup!: FormGroup;

  public contactDetailsFormModel!: DynamicFormModel;
  public contactDetailsFormGroup!: FormGroup;

  private isNew = true;

  private dynamicFormService: DynamicFormService = inject(DynamicFormService);
  private entityService: ContactsService = inject(ContactsService);

  constructor() {

    super();

    this.logger.info('Contact Wizard Component: constructor()');

    this.nameFormModel = this.route.snapshot.data['metaData'].nameFormModel;
    this.addressFormModel = this.route.snapshot.data['metaData'].addressFormModel;
    this.contactDetailsFormModel = this.route.snapshot.data['metaData'].contactDetailsFormModel;

    // this.logger.info('nameFormModel: ' + JSON.stringify(this.nameFormModel, null, 2));
    // this.logger.info('addressFormModel: ' + JSON.stringify(this.addressFormModel, null, 2));
    // this.logger.info('contactDetailsFormModel: ' + JSON.stringify(this.contactDetailsFormModel, null, 2));

  }

  override createSteps(): void {

    this.logger.info('Contact Wizard Component: createSteps()');

    //
    // To save me some typing ...
    //

    this.createSampleContact();

    this.nameFormGroup = this.dynamicFormService.createGroup(this.nameFormModel);
    this.addressFormGroup = this.dynamicFormService.createGroup(this.addressFormModel);
    this.contactDetailsFormGroup = this.dynamicFormService.createGroup(this.contactDetailsFormModel);

    this.dynamicFormService.initGroup(this.nameFormGroup, this.item);
    this.dynamicFormService.initGroup(this.addressFormGroup, this.item.party.addresses[0]);

  }

  //
  // Validation
  //

  public canDeactivate(): Observable<boolean> | boolean {

    if (!this.isDirty() && this.isValid()) {
      return true;
    }

    return this.dialogService.openConfirm({
      title: 'Contact',
      message: 'Are you sure you want to leave this page?',
      acceptButton: 'OK',
      cancelButton: 'CANCEL'
    }).afterClosed();

  }

  public isDirty(): boolean {

    let dirty = false;

    if ((this.nameFormGroup && this.nameFormGroup.dirty) ||
      (this.addressFormGroup && this.addressFormGroup.dirty)) {
      dirty = true;
    }

    // this.logger.info('ContactComponent - isDirty(): ' + dirty);

    return dirty;
  }

  public isValid(): boolean {

    let valid = false;

    if (this.nameFormGroup) {

      valid = true;

      const controls = this.nameFormGroup.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          this.logger.info('generalInformationGroup ' + name + ' is invalid');
          valid = false;
        }
      }

    }

    if (valid && this.addressFormGroup) {

      valid = true;

      const controls = this.addressFormGroup.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          this.logger.info('addressInformationGroup ' + name + ' is invalid');
          valid = false;
        }
      }

    }

    /*

    if (this.generalInformationGroup && this.generalInformationGroup.valid) {

      this.logger.info('ContactComponent - generalInformationGroup.valid');

      if (this.addressInformationGroup && this.addressInformationGroup.valid) {

        this.logger.info('ContactComponent - addressInformationGroup.valid');

        valid = true;
      }

    }

    */

    // this.logger.info('ContactComponent - isValid(): ' + valid);

    return valid;
  }

  public markAsPristine(): void  {

    // this.logger.info('ContactWizardComponent - markAsPristine()');

    if (this.nameFormGroup) {
      this.nameFormGroup.markAsPristine();
    }

    if (this.addressFormGroup) {
      this.addressFormGroup.markAsPristine();
    }

  }

  //
  // Command Bar events
  //

  public onClose(): void {

    this.logger.info('Contact Wizard Component: onClose()');

    this.router.navigate([CONTACTS]);
  }

  public onCustomEvent(event: any) {

    this.logger.info('Contact Wizard Component: onCustomEvent()');

    // this.dialogService.openAlert({
    //   title: 'Alert',
    //   message: JSON.stringify(event),
    //   closeButton: 'CLOSE'
    // });

    // this.openLookupAccountDialog();

  }

  public onSave(): void  {

    this.logger.info('Contact Wizard Component: onSave()');

    this.dynamicFormService.value(this.nameFormGroup, this.item);
    this.dynamicFormService.value(this.addressFormGroup, this.item.party.addresses[0]);

    this.logger.info('contact: ' + JSON.stringify(this.item, null, 2) + '\n');

    if (this.isNew) {
      this.create();
    } else {
      this.update();
    }

  }

  public onSaveAndClose(): void  {

    this.logger.info('Contact Wizard  Component: onSaveAndClose()');

    this.onSave();

    this.router.navigate([CONTACTS]);
  }

  //
  // Misc
  //

  private create(): void  {

    this.logger.info('Contact Wizard Component: create()');

    const subscription: Subscription = this.entityService.create(this.item).subscribe(() => {

      this.markAsPristine();
      this.openSnackBar('Contact saved');

      subscription.unsubscribe();

      this.isNew = false;

    });

  }

  private openSnackBar(message: string): void {

    this.snackBar.openFromComponent(SnackBar, {
      data: {
        message: message
      },
      duration: 500,
      panelClass: 'md-snack-bar'
    });

  }

  private update(): void  {

    this.logger.info('Contact Wizard Component: update()');

    let id: string = '';

    if (this.item.party.id != null) {
      id = this.item.party.id;
    }

    const subscription: Subscription = this.entityService.update(id, this.item).subscribe(response => {

      this.logger.info('contact: ' + JSON.stringify(response, null, 2) + '\n');

      this.markAsPristine();
      this.openSnackBar('Contact updated');

      subscription.unsubscribe();

      this.isNew = false;

    });

  }

  private createSampleContact(): void {

    const name: NameModel = new NameModel(
      'Mr',
      'Robert',
      '',
      'Ferguson',
      'Rob',
      'R',
      '',
      'Mr Ferguson'
    );

    const event = new Date('13 January 2002 10:00 UTC');
    const dateOfBirth = event.toISOString();

    this.item = new ContactModel(
      new PartyModel(PartyType.INDIVIDUAL),
      name,
      'Male',
      'hey@rob-ferguson.me',
      '(02) 9999 9999',
      'assets/images/male-avatar.svg',
      'Sydney',
      dateOfBirth,
      'Sydney',
      'Australia'
    );

    this.item.party.displayName = 'Rob Ferguson';

    const address = new AddressModel(
      new LocationModel(LocationType.ADDRESS),
      '',
      '93 Janet Street',
      '',
      'Merewether', 'NSW', '2291',
      'Australia',
      'Principal Place of Residence'
    );

    this.item.party.addresses.push(address);

    // this.item.organisation.displayName = 'Van Orton Trading Pty Ltd';
    // this.item.organisation.email = 'hey@rob-ferguson.me';
    // this.item.organisation.phoneNumber = '(02) 9999 9999';

  }

}
