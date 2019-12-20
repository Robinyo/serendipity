import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { MatSnackBar } from '@angular/material';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';

import { DynamicFormControlCustomEvent, DynamicFormModel, DynamicFormService } from 'dynamic-forms';

import { ContactsService } from '../../services/contacts/contacts.service';
import { Contact } from '../../models/contact';

import { CONTACTS } from '../../models/constants';
import { CONTACT_ADDRESS_INFORMATION_GROUP, CONTACT_GENERAL_INFORMATION_GROUP } from '../../models/form-ids';

import { DialogService } from 'serendipity-components';

import { LoggerService } from 'utils';

import {
  NAVIGATION_BAR_HEIGHT_DESKTOP,
  // NAVIGATION_BAR_HEIGHT_MOBILE,
  COMMAND_BAR_HEIGHT_DESKTOP,
  // COMMAND_BAR_HEIGHT_MOBILE,
  VIEW_BAR_HEIGHT_DESKTOP,
  // VIEW_BAR_HEIGHT_MOBILE,
  MARGIN_DESKTOP,
  // MARGIN_MOBILE,
  // MAT_XSMALL
} from '../../models/constants';

@Component({
  selector: 'sales-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {

  public containerHeight: number;

  // public id = 'MA==';
  public partyId: string;
  public item: Contact;

  protected subscriptions: Subscription[] = [];

  @ViewChild('contentContainer', {static: true})
  private tableContainer: ElementRef;

  public generalInformationModel: DynamicFormModel; // DynamicFormControlModel[] = [];
  public generalInformationGroup: FormGroup;

  public addressInformationModel: DynamicFormModel; // DynamicFormControlModel[] = [];
  public addressInformationGroup: FormGroup;

  private navBarHeight = NAVIGATION_BAR_HEIGHT_DESKTOP;
  private cmdBarHeight = COMMAND_BAR_HEIGHT_DESKTOP;
  private viewBarHeight = VIEW_BAR_HEIGHT_DESKTOP;
  private margin = MARGIN_DESKTOP;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private contactsService: ContactsService,
              private dynamicFormService: DynamicFormService,
              private dialogService: DialogService,
              private snackBar: MatSnackBar,
              private logger: LoggerService) {}

  public ngOnInit() {

    this.logger.info('ContactComponent: ngOnInit()');

    this.containerHeight = this.tableContainer.nativeElement.offsetHeight -
      (this.navBarHeight + this.cmdBarHeight + this.viewBarHeight + this.margin);

    // this.partyId = this.route.snapshot.paramMap.get('id');

    let paramSubscription: Subscription = new Subscription();
    this.subscriptions.push(paramSubscription);

    paramSubscription = this.route.paramMap.subscribe(params =>  {

      this.partyId = params.get('id');
      this.partyId = atob(this.partyId);

      this.subscribe();

    });

  }

  protected async subscribe() {

    this.logger.info('ContactComponent: subscribe()');

    this.generalInformationModel = await this.dynamicFormService.getFormMetadata(CONTACT_GENERAL_INFORMATION_GROUP);
    this.generalInformationGroup = this.dynamicFormService.createGroup(this.generalInformationModel);

    this.addressInformationModel = await this.dynamicFormService.getFormMetadata(CONTACT_ADDRESS_INFORMATION_GROUP);
    this.addressInformationGroup = this.dynamicFormService.createGroup(this.addressInformationModel);

    let modelSubscription: Subscription = new Subscription();
    this.subscriptions.push(modelSubscription);

    modelSubscription = this.contactsService.findOne(this.partyId).subscribe(data => {

      this.logger.info('ContactComponent subscribe() data: ' + JSON.stringify(data));

      this.item = data;
      this.dynamicFormService.initGroup(this.generalInformationGroup, this.item);
      this.dynamicFormService.initGroup(this.addressInformationGroup, this.item.party.addresses[0]);
    });

  }

  protected unsubscribe(): void {

    this.logger.info('ContactComponent: unsubscribe()');

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

  }

  public ngOnDestroy() {

    this.logger.info('ContactComponent: ngOnDestroy()');
    this.unsubscribe();
  }

  //
  // Validation
  //

  public canDeactivate(): Observable<boolean> | boolean {

    // this.logger.info('ContactComponent: canDeactivate()');

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

    // this.logger.info('ContactComponent - isDirty()');

    let dirty = false;

    if ((this.generalInformationGroup && this.generalInformationGroup.dirty) ||
        (this.addressInformationGroup && this.addressInformationGroup.dirty)) {
      dirty = true;
    }

    return dirty;
  }

  public isValid() {

    // this.logger.info('ContactComponent - isValid()');

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

    // this.logger.info('ContactComponent - markAsPristine()');

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

    this.logger.info('ContactComponent: onClose()');

    this.router.navigate([CONTACTS]);
  }

  public onCustomEvent(event: DynamicFormControlCustomEvent) {

    this.logger.info('ContactComponent: onCustomEvent()');

    this.dialogService.openAlert({
      title: 'Alert',
      message: JSON.stringify(event),
      closeButton: 'CLOSE'
    });

    // this.logger.info('event: ' + JSON.stringify(event));
  }

  public onDeactivate() {

    this.logger.info('ContactComponent: onDeactivate()');

    this.dialogService.openConfirm({
      title: 'Contact',
      message: 'Are you sure you want to delete this contact?',
      acceptButton: 'OK',
      cancelButton: 'CANCEL'
    }).afterClosed().subscribe(response => {

      // this.logger.info(`ContactComponent onDeactivate() response: ${response}`);

      if (response) {

        this.logger.info('ContactComponent onDeactivate() response: true');

        const subscription: Subscription = this.contactsService.delete(this.partyId).subscribe(() => {

          subscription.unsubscribe();
          this.router.navigate([CONTACTS]);
        });

      }

    });

  }

  public onNew() {

    this.logger.info('ContactComponent: onNew()');

    this.router.navigate([CONTACTS + '/new']);
  }

  public onSave() {

    this.logger.info('ContactComponent: onSave()');

    this.dynamicFormService.value(this.generalInformationGroup, this.item);
    this.dynamicFormService.value(this.addressInformationGroup, this.item.party.addresses[0]);

    this.logger.info('contact: ' + JSON.stringify(this.item, null, 2) + '\n');

    this.update();
  }

  public onSaveAndClose() {

    this.logger.info('ContactComponent: onSaveAndClose()');

    this.onSave();

    this.router.navigate([CONTACTS]);
  }

  //
  // Misc
  //

  private openSnackBar() {

    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 500,
      panelClass: 'crm-snack-bar'
    });

  }

  private update() {

    this.logger.info('ContactComponent: update()');

    const subscription: Subscription = this.contactsService.update(this.item.party.id, this.item).subscribe(response => {

      const keys = response.headers.keys();
      keys.map(key => {
        this.logger.info('ContactComponent update() key: ' + response.headers.get(key));
      });

      this.item = { ...response.body };

      this.logger.info('contact: ' + JSON.stringify(this.item, null, 2) + '\n');

      this.markAsPristine();
      this.openSnackBar();

      subscription.unsubscribe();

    });

  }

}
