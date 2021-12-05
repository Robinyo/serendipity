import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { DynamicFormControlCustomEvent, DynamicFormModel, DynamicFormService} from 'dynamic-forms-lib';
import { SnackBarComponent, WizardComponent } from 'serendipity-components-lib';

import { ContactsService } from '../../services/contacts/contacts.service';

import { CONTACTS } from '../../models/constants';
import { CONTACT_WIZARD_GENERAL_INFORMATION_GROUP, CONTACT_WIZARD_ADDRESS_INFORMATION_GROUP } from '../../models/form-ids';
import { Address } from '../../models/address';
import { Contact } from '../../models/contact';
import { Location } from '../../models/location';
import { Name } from '../../models/name';
import { Party } from '../../models/party';

import { LocationType } from '../../types/location-type';
import { PartyType } from '../../types/party-type';

@Component({
  selector: 'party-contact-wizard',
  templateUrl: './contact-wizard.component.html',
  styleUrls: ['./contact-wizard.component.scss']
})
export class ContactWizardComponent extends WizardComponent<Contact> {

  public generalInformationModel!: DynamicFormModel;
  public generalInformationGroup!: FormGroup;

  public addressInformationModel!: DynamicFormModel;
  public addressInformationGroup!: FormGroup;

  private isNew = true;

  constructor(private router: Router,
              private entityService: ContactsService,
              private dynamicFormService: DynamicFormService) {

    super();
  }

  async createSteps() {

    this.logger.info('ContactWizardComponent: createWizardSteps()');

    //
    // To save me some typing ...
    //

    // this.createSampleContact();

    this.createSampleContact();

    this.generalInformationModel = await this.dynamicFormService.getFormMetadata(CONTACT_WIZARD_GENERAL_INFORMATION_GROUP);
    this.generalInformationGroup = this.dynamicFormService.createGroup(this.generalInformationModel);
    this.dynamicFormService.initGroup(this.generalInformationGroup, this.item);

    this.addressInformationModel = await this.dynamicFormService.getFormMetadata(CONTACT_WIZARD_ADDRESS_INFORMATION_GROUP);
    this.addressInformationGroup = this.dynamicFormService.createGroup(this.addressInformationModel);
    this.dynamicFormService.initGroup(this.addressInformationGroup, this.item.party.addresses[0]);

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

    if ((this.generalInformationGroup && this.generalInformationGroup.dirty) ||
        (this.addressInformationGroup && this.addressInformationGroup.dirty)) {
      dirty = true;
    }

    // this.logger.info('ContactComponent - isDirty(): ' + dirty);

    return dirty;
  }

  public isValid(): boolean {

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

  public onClose(): void {

    this.logger.info('ContactWizardComponent: onClose()');

    this.router.navigate([CONTACTS]);
  }

  public onCustomEvent(event: DynamicFormControlCustomEvent) {

    this.logger.info('ContactWizardComponent: onCustomEvent()');

    // this.dialogService.openAlert({
    //   title: 'Alert',
    //   message: JSON.stringify(event),
    //   closeButton: 'CLOSE'
    // });

    // this.openLookupAccountDialog();

  }

  public onSave(): void  {

    this.logger.info('ContactWizardComponent: onSave()');

    this.dynamicFormService.value(this.generalInformationGroup, this.item);
    this.dynamicFormService.value(this.addressInformationGroup, this.item.party.addresses[0]);

    this.logger.info('contact: ' + JSON.stringify(this.item, null, 2) + '\n');

    if (this.isNew) {
      this.create();
    } else {
      this.update();
    }

  }

  public onSaveAndClose(): void  {

    this.logger.info('ContactWizardComponent: onSaveAndClose()');

    this.onSave();

    this.router.navigate([CONTACTS]);
  }

  //
  // Misc
  //

  private create(): void  {

    this.logger.info('ContactWizardComponent: create()');

    const subscription: Subscription = this.entityService.create(this.item).subscribe(() => {

      this.markAsPristine();
      this.openSnackBar('Contact saved');

      subscription.unsubscribe();

      this.isNew = false;

    });

  }

  private openSnackBar(message: string): void {

    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: message
      },
      duration: 500,
      panelClass: 'md-snack-bar'
    });

  }

  private update(): void  {

    this.logger.info('ContactWizardComponent: update()');

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

    const name: Name = new Name(
      'Mr',
      'Robert',
      '',
      'Ferguson',
      'Rob',
      'R.',
      '',
      'Mr Ferguson'
    );

    const event = new Date('13 January 1982 10:00 UTC');
    const dateOfBirth = event.toISOString();

    this.item = new Contact(
      new Party(PartyType.INDIVIDUAL),
      name,
      'Male',
      'rob.ferguson@robferguson.org',
      '(02) 9999 9999',
      'assets/images/photos/male-avatar.svg',
      'Sydney',
      dateOfBirth,
      'Sydney',
      'Australia'
    );

    this.item.party.displayName = 'Ferguson, Rob';

    const address = new Address(
      new Location(LocationType.ADDRESS),
      '',
      '93 Janet Street',
      '',
      'Merewether', 'NSW', '2291',
      'Australia',
      'Principal Place of Residence'
    );

    this.item.party.addresses.push(address);

    // this.item.organisation.displayName = 'Van Orton Trading Pty Ltd';
    // this.item.organisation.email = 'rob.ferguson@robferguson.org';
    // this.item.organisation.phoneNumber = '(02) 9999 9999';

  }

}
