import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable, Subscription } from 'rxjs';

import { DynamicFormControlCustomEvent, DynamicFormModel, DynamicFormService} from 'dynamic-forms-lib';
import { DialogService, SnackBarComponent } from 'serendipity-components-lib';
import { LoggerService } from 'utils-lib';

import { ContactsService } from '../../services/contacts/contacts.service';

import { CONTACTS } from '../../models/constants';
import { CONTACT_ADDRESS_INFORMATION_GROUP, CONTACT_GENERAL_INFORMATION_GROUP } from '../../models/form-ids';
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
export class ContactWizardComponent implements OnInit, OnDestroy {

  public generalInformationModel!: DynamicFormModel;
  public generalInformationGroup!: FormGroup;

  public addressInformationModel!: DynamicFormModel;
  public addressInformationGroup!: FormGroup;

  public item!: Contact;

  private isNew = true;

  constructor(private router: Router,
              private contactsService: ContactsService,
              private dynamicFormService: DynamicFormService,
              private dialogService: DialogService,
              private snackBar: MatSnackBar,
              private logger: LoggerService) {}

  public ngOnInit() {

    this.logger.info('ContactWizardComponent: ngOnInit()');

    this.createWizardSteps();
  }

  async createWizardSteps() {

    this.logger.info('ContactWizardComponent: createWizardSteps()');

    //
    // To save me some typing ...
    //

    this.createSampleContact();

    this.generalInformationModel = await this.dynamicFormService.getFormMetadata(CONTACT_GENERAL_INFORMATION_GROUP);
    this.generalInformationGroup = this.dynamicFormService.createGroup(this.generalInformationModel);
    this.dynamicFormService.initGroup(this.generalInformationGroup, this.item);

    this.addressInformationModel = await this.dynamicFormService.getFormMetadata(CONTACT_ADDRESS_INFORMATION_GROUP);
    this.addressInformationGroup = this.dynamicFormService.createGroup(this.addressInformationModel);
    this.dynamicFormService.initGroup(this.addressInformationGroup, this.item.party.addresses[0]);

  }

  public ngOnDestroy() {

    this.logger.info('ContactWizardComponent: ngOnDestroy()');
  }

  //
  // Command Bar events
  //

  public onClose() {

    this.logger.info('ContactWizardComponent: onClose()');

    this.router.navigate([CONTACTS]);
  }

  public onCustomEvent(event: DynamicFormControlCustomEvent) {

    this.logger.info('ContactWizardComponent: onCustomEvent()');

    this.dialogService.openAlert({
      title: 'Alert',
      message: JSON.stringify(event),
      closeButton: 'CLOSE'
    });

    // this.logger.info('event: ' + JSON.stringify(event));
  }

  public onSave() {

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

  public onSaveAndClose() {

    this.logger.info('ContactWizardComponent: onSaveAndClose()');

    this.onSave();

    this.router.navigate([CONTACTS]);
  }

  //
  // Validation
  //

  public canDeactivate(): Observable<boolean> | boolean {

    // this.logger.info('ContactWizardComponent: canDeactivate()');

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

  public isDirty() {

    // this.logger.info('ContactWizardComponent - isDirty()');

    let dirty = false;

    if ((this.generalInformationGroup && this.generalInformationGroup.dirty) ||
      (this.addressInformationGroup && this.addressInformationGroup.dirty)) {
      dirty = true;
    }

    return dirty;
  }

  public isValid() {

    // this.logger.info('ContactWizardComponent - isValid()');

    let valid = false;

    if (this.generalInformationGroup && this.generalInformationGroup.valid) {

      if (this.addressInformationGroup && this.addressInformationGroup.valid) {

        valid = true;
        // this.logger.info('valid: ' + valid);
      }

    }

    return valid;
  }

  public markAsPristine() {

    // this.logger.info('ContactWizardComponent - markAsPristine()');

    if (this.generalInformationGroup) {
      this.generalInformationGroup.markAsPristine();
    }

    if (this.addressInformationGroup) {
      this.addressInformationGroup.markAsPristine();
    }

  }

  //
  // Misc
  //

  private create() {

    this.logger.info('ContactWizardComponent: create()');

    const subscription: Subscription = this.contactsService.create(this.item).subscribe(response => {

      this.markAsPristine();
      this.openSnackBar();

      subscription.unsubscribe();

      this.isNew = false;

    });

  }

  private openSnackBar() {

    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: 'Contact saved'
      },
      duration: 500,
      panelClass: 'crm-snack-bar'
    });

  }

  private update() {

    this.logger.info('ContactWizardComponent: update()');

    let id: string = '';

    if (this.item.party.id != null) {
      id = this.item.party.id;
    }

    const subscription: Subscription = this.contactsService.update(id, this.item).subscribe(response => {

      this.logger.info('contact: ' + JSON.stringify(response, null, 2) + '\n');

      this.markAsPristine();
      this.openSnackBar();

      subscription.unsubscribe();

      this.isNew = false;

    });

  }

  private createSampleContact() {

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

    this.item = new Contact(
      new Party(PartyType.INDIVIDUAL),
      name,
      'Male',
      'rob.ferguson@robferguson.org',
      '(02) 9999 9999',
      'assets/images/photos/male-avatar.svg'
    );

    this.item.party.displayName = 'Ferguson, Rob';

    this.item.organisation.displayName = 'Van Orton Trading Pty Ltd';
    this.item.organisation.email = 'rob.ferguson@robferguson.org';
    this.item.organisation.phoneNumber = '(02) 9999 9999';

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

  }

}
