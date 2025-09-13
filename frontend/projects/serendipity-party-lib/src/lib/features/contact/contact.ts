import { Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Observable, Subscription } from 'rxjs';

import { ActivityBar, CommandBar, Item } from 'serendipity-components-lib';
import { DynamicFormControlCustomEvent, DynamicFormModel, DynamicFormService } from 'serendipity-dynamic-forms-lib';

import { latLng, LatLng, LatLngBounds, Layer, LeafletEvent, LeafletMouseEvent, Map, MapOptions, tileLayer } from 'leaflet';

import { ContactsService } from '../../services/contacts/contacts';
// import { ElectoralDivisionsService } from '../../services/electoral-divisions/electoral-divisions.service';
// import { LookupAccountDialogComponent } from "../dialogs/lookup-account-dialog/lookup-account-dialog.component";

import { AccountModel } from '../../models/account';
import { ContactModel } from '../../models/contact';
import { DialogResult } from "../../models/dialog";
import { ElectoralDivisionModel } from '../../models/electoral-division';
import { RoleModel } from '../../models/role';

import { CONTACT_WIZARD, CONTACTS } from './constants';
import { CONTACT_ADDRESS_INFORMATION_GROUP, CONTACT_GENERAL_INFORMATION_GROUP } from './form-ids';

class LeafletControlLayersConfig {
  baseLayers: { [name: string]: Layer } = {};
  overlays: { [name: string]: Layer } = {};
}

class MapLayersControl extends LeafletControlLayersConfig {}

const DEFAULT_ZOOM = 13;
const DEFAULT_LATITUDE = -28.15;
const DEFAULT_LONGITUDE = 133.28;
const ELECTORAL_DIVISION_TAB_INDEX = 3;

@Component({
  selector: 'party-contact',
  imports: [
    ActivityBar,
    CommandBar,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './contact.html',
  standalone: true,
  styleUrls: ['./contact.scss']
})
export class Contact extends Item<ContactModel> {

  public generalInformationModel!: DynamicFormModel;
  public generalInformationGroup!: FormGroup;

  public addressInformationModel!: DynamicFormModel;
  public addressInformationGroup!: FormGroup;

  private electoralDivision!: ElectoralDivisionModel;

  public mapOptions: MapOptions;
  public mapLayersControl!: MapLayersControl;

  private entityService: ContactsService = inject(ContactsService);
  private dynamicFormService: DynamicFormService = inject(DynamicFormService);
  // private electoralDivisionsService: ElectoralDivisionsService

  // private route: ActivatedRoute = inject(ActivatedRoute);

  private map!: Map;

  constructor() {

    super();

    this.route = inject(ActivatedRoute);

    this.mapOptions = {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        })
      ],
      zoom: 4,
      center: latLng([-28.15, 133.28])
    };

  }

  protected subscribe() {

    this.logger.info('ContactComponent: subscribe()');

    // this.generalInformationModel = await this.dynamicFormService.getFormMetadata(CONTACT_GENERAL_INFORMATION_GROUP);
    // this.generalInformationGroup = this.dynamicFormService.createGroup(this.generalInformationModel);

    // this.addressInformationModel = await this.dynamicFormService.getFormMetadata(CONTACT_ADDRESS_INFORMATION_GROUP);
    // this.addressInformationGroup = this.dynamicFormService.createGroup(this.addressInformationModel);

    let entitySubscription: Subscription = new Subscription();
    this.subscriptions.push(entitySubscription);

    entitySubscription = this.entityService.findById(this.id).subscribe(data => {

      this.item = data;

      this.detectChanges();

      this.logger.info('item: ' + JSON.stringify(this.item, null, 2));

      // this.dynamicFormService.initGroup(this.generalInformationGroup, this.item);
      // this.dynamicFormService.initGroup(this.addressInformationGroup, this.item.party.addresses[0]);
    });

  }

  //
  // Validation
  //

  public canDeactivate(): Observable<boolean> | boolean {

    this.logger.info('ContactComponent: canDeactivate()');

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

    // this.logger.info('ContactComponent: markAsPristine()');

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

        const subscription: Subscription = this.entityService.delete(this.id).subscribe(() => {

          subscription.unsubscribe();
          this.router.navigate([CONTACTS]);
        });

      }

    });

  }

  public onNew() {

    this.logger.info('ContactComponent: onNew()');

    this.router.navigate([CONTACT_WIZARD]);
  }

  public onSave() {

    this.logger.info('ContactComponent: onSave()');

    this.dynamicFormService.value(this.generalInformationGroup, this.item);
    this.dynamicFormService.value(this.addressInformationGroup, this.item.party.addresses[0]);

    // this.logger.info('contact: ' + JSON.stringify(this.item, null, 2) + '\n');

    this.update();
  }

  public onSaveAndClose() {

    this.logger.info('ContactComponent: onSaveAndClose()');

    this.onSave();
    this.onClose();
  }

  //
  // Dynamic Form events
  //

  /*

  public onCustomEvent(event: DynamicFormControlCustomEvent) {

    this.logger.info('ContactComponent: onCustomEvent()');

    if (event.id === 'organisation.displayName' && event.name === 'search') {

      this.openLookupAccountDialog();

    } else {

      this.dialogService.openAlert({
        title: 'Alert',
        message: JSON.stringify(event),
        closeButton: 'CLOSE'
      });

    }

  }

  */

  /*

  private openLookupAccountDialog() {

    this.logger.info('ContactComponent: openLookupAccountDialog()');

    let config = {
      disableRemoveButton: true,
      hideRemoveButton: false,
      addButtonLabel: 'ADD'
    };

    this.item.party.roles.every((item, index) => {

      if (item.role === 'Contact' && item.reciprocalRole === 'Account') {

        config.disableRemoveButton = false;

        return false;
      }

      return true;

    });

    this.logger.info('config: ' + JSON.stringify(config, null, 2) + '\n');

    const dialogRef = this.dialogService.open(LookupAccountDialogComponent, { data: config });

    dialogRef.afterClosed().subscribe((response: DialogResult) => {

      this.logger.info('response: ' + JSON.stringify(response, null, 2) + '\n');

      if (!response.result) { return; }

      switch (response.action) {

        case 'add':

          this.removeAccount();
          this.addAccount(response);

          break;

        case 'remove':

          this.removeAccount();
          break;

        default:

          this.logger.error('openLookupAccountDialog() -> default');
          break;

      }

      // this.markAsDirty();

    });

  }

  */

  private addAccount(response: DialogResult): void {

    this.logger.info('addAccount()');

    const contact: ContactModel = this.item;
    const account: AccountModel = response.record;

    const role: RoleModel = {

      // @ts-ignore
      partyId: contact.party.id,
      partyType: contact.party.type,
      partyName: contact.party.displayName,
      partyEmail: contact.email,
      partyPhoneNumber: contact.phoneNumber,

      role: 'Contact',
      relationship: 'Membership',
      reciprocalRole: 'Account',

      // @ts-ignore
      reciprocalPartyId: account.party.id,
      reciprocalPartyType: account.party.type,
      reciprocalPartyName: account.party.displayName,
      reciprocalPartyEmail: account.email,
      reciprocalPartyPhoneNumber: account.phoneNumber
    };

    const subscription: Subscription = this.entityService.createRole(this.id, role).subscribe(data => {

      if (data.body != null ) {

        this.item.party.roles.push(data.body);

        // Organisation Ref
        this.item.organisation.id = data.body.reciprocalPartyId;
        this.item.organisation.displayName = data.body.reciprocalPartyName;
        this.item.organisation.email = data.body.reciprocalPartyEmail;
        this.item.organisation.phoneNumber = data.body.reciprocalPartyPhoneNumber;

        // contact-general-information-form-with-avatar.json
        this.generalInformationGroup.controls['organisation.displayName'].setValue(this.item.organisation.displayName);

      }

      subscription.unsubscribe();

    });

  }

  private removeAccount(): void {

    this.logger.info('removeAccount()');

    this.item.party.roles.every((role, index) => {

      if (role.role === 'Contact' && role.reciprocalRole === 'Account') {

        this.logger.info('remove -> role === Contact && reciprocalRole === Account');

        // @ts-ignore
        const subscription: Subscription = this.entityService.deleteRole(this.id, role.id).subscribe(() => {

          // remove the Role
          this.item.party.roles.splice(index, 1);

          // Organisation Ref
          this.item.organisation.id = '';
          this.item.organisation.displayName = '';
          this.item.organisation.email = '';
          this.item.organisation.phoneNumber = '';

          // contact-general-information-form-with-avatar.json
          this.generalInformationGroup.controls['organisation.displayName'].setValue('');

          subscription.unsubscribe();

        });

        return false;
      }

      return true;

    });

  }

  private update(): void {

    this.logger.info('ContactComponent: update()');

    // contact.id = btoa(item.id);
    // this.id = atob(this.id);
    this.item.id = this.id;

    this.logger.info('item: ' + JSON.stringify(this.item, null, 2) + '\n');

    const subscription: Subscription = this.entityService.update(this.id, this.item).subscribe(() => {

      this.markAsPristine();
      // this.openSnackBar();

      subscription.unsubscribe();

    });

  }

  //
  // Misc events
  //

  public onMapReady(map: Map): void {

    this.logger.info('ContactComponent: onMapReady()');

    this.map = map;
  }

  /*

  public async onTabChanged($event: any) {

    this.logger.info('ContactComponent: onTabChanged()');

    const clickedIndex = $event.index;

    this.logger.info('clickedIndex: ' + clickedIndex);

    if (clickedIndex === ELECTORAL_DIVISION_TAB_INDEX && this.item !== undefined && this.item.electorate) {

      if (this.electoralDivision === undefined) {

        this.electoralDivision = await this.electoralDivisionsService.findByName(this.item.electorate);

        this.logger.info('Electoral Division: ' + JSON.stringify(this.electoralDivision, null, 2) + '\n');

        let latitude = DEFAULT_LATITUDE;
        let longitude = DEFAULT_LONGITUDE;

        if (!isNaN(Number(this.electoralDivision.latitude))) {
          latitude = Number(this.electoralDivision.latitude);
        }

        if (!isNaN(Number(this.electoralDivision.longitude))) {
          longitude = Number(this.electoralDivision.longitude);
        }

        if (this.map !== undefined) {
          this.map.setView(latLng(latitude, longitude), DEFAULT_ZOOM);
          this.map.invalidateSize();
        }

      }

    }

  }

  //
  // Misc
  //

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

}
