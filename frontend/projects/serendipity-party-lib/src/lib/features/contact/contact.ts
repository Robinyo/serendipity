import { Component, inject, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelContent, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

import { Observable, Subscription } from 'rxjs';

import { ActivityBar, CommandBar, Item } from 'serendipity-components-lib';
import { FormJsWrapper } from 'serendipity-camunda-lib';

import { latLng, LatLng, LatLngBounds, Layer, LeafletEvent, LeafletMouseEvent, Map, MapOptions, tileLayer } from 'leaflet';
import { LeafletModule } from '@bluehalo/ngx-leaflet';

import { ContactsService } from '../../services/contacts/contacts';
import { ElectoralDivisionsService } from '../../services/electoral-divisions/electoral-divisions';
import { ContactRelatedTab } from '../../components/contact/contact-related-tab/contact-related-tab';
// import { LookupAccountDialogComponent } from "../dialogs/lookup-account-dialog/lookup-account-dialog.component";

import { AccountModel } from '../../models/account';
import { AddressModel } from '../../models/address';
import { ContactModel } from '../../models/contact';
import { DialogResult } from "../../models/dialog";
import { ElectoralDivisionModel } from '../../models/electoral-division';
import { RoleModel } from '../../models/role';

import { CONTACT_WIZARD, CONTACTS, Tab } from './constants';

class LeafletControlLayersConfig {
  baseLayers: { [name: string]: Layer } = {};
  overlays: { [name: string]: Layer } = {};
}

class MapLayersControl extends LeafletControlLayersConfig {}

const DEFAULT_ZOOM = 13;
const DEFAULT_LATITUDE = -32.841;
const DEFAULT_LONGITUDE = 151.753;

const ACCORDION = 'accordion';
const CARD = 'card';

@Component({
  selector: 'party-contact',
  imports: [
    ActivityBar,
    CommandBar,
    ContactRelatedTab,
    FormJsWrapper,
    LeafletModule,
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
  templateUrl: './contact.html',
  standalone: true,
  styleUrls: ['./contact.scss']
})
export class Contact extends Item<ContactModel> {

  @ViewChild('formRef') form!: FormJsWrapper;

  // public viewMode = ACCORDION;
  public viewMode = CARD;

  public selectedTabIndex = 0;
  public schema!: any;

  public mapLayersControl!: MapLayersControl;
  public mapOptions: MapOptions;

  private electoralDivision!: ElectoralDivisionModel;

  private electoralDivisionsService: ElectoralDivisionsService = inject(ElectoralDivisionsService);
  private entityService: ContactsService = inject(ContactsService);

  private map!: Map;

  constructor() {

    super();

    this.logger.info('Contact Component: constructor()');

    this.schema = this.route.snapshot.data['metaData'].generalInformationFormDefs;

    // this.logger.info('schema: ' + JSON.stringify(this.schema, null, 2));

    this.mapOptions = {
      layers: [
        tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        })
      ],
      zoom: DEFAULT_ZOOM,
      center: latLng([DEFAULT_LATITUDE, DEFAULT_LONGITUDE])
    };

  }

  protected subscribe() {

    this.logger.info('Contact Component: subscribe()');

    this.isLoading = true;

    const entitySubscription: Subscription = this.entityService.findById(this.id).subscribe(

      (response: any) => {

        this.logger.info('Contact Component: subscribe() success handler');

        this.item = response;

        this.logger.info('id: ' + this.id + ' item id: ' + this.item.id);
        this.logger.info('item: ' + JSON.stringify(this.item, null, 2));

        this.isLoading = false;

        this.detectChanges();

    });

    this.subscriptions.push(entitySubscription);

  }

  //
  // Validation
  //

  public canDeactivate(): Observable<boolean> | boolean {

    this.logger.info('Contact Component: canDeactivate()');

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

    this.logger.info('Contact Component: isDirty()');

    let dirty = false;

    if (this.form) {
      dirty = this.form.isDirty();
    }

    this.logger.info('dirty === ' + dirty);

    return dirty;

  }

  public isValid() {

    this.logger.info('Contact Component: isValid()');

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

    this.logger.info('Contact Component: onClose()');

    this.router.navigate([CONTACTS]);
  }

  public onDeactivate() {

    this.logger.info('Contact Component: onDeactivate()');

    this.dialogService.openConfirm({
      title: 'Contact',
      message: 'Are you sure you want to delete this contact?',
      acceptButton: 'OK',
      cancelButton: 'CANCEL'
    }).afterClosed().subscribe(response => {

      // this.logger.info(`ContactComponent onDeactivate() response: ${response}`);

      if (response) {

        this.logger.info('Contact Component onDeactivate() response: true');

        const subscription: Subscription = this.entityService.delete(this.id).subscribe(() => {

          subscription.unsubscribe();
          this.router.navigate([CONTACTS]);

        });

      }

    });

  }

  public onNew() {

    this.logger.info('Contact Component: onNew()');

    this.router.navigate([CONTACT_WIZARD]);
  }

  public onSave() {

    this.logger.info('Contact Component: onSave()');

    const rawFormData = this.form.getData();

    this.logger.info('rawFormData: ' + JSON.stringify(rawFormData, null, 2) + '\n');

    this.logger.info('dto: ' + JSON.stringify(this.item, null, 2) + '\n');

    // Copy your original DTO reference so you don't mutate state unexpectedly
    const updatedDto = JSON.parse(JSON.stringify(this.item));

    // Patch the DTO using the recursive mapper
    this.patchDtoWithFormData(updatedDto, rawFormData);

    // TODO
    delete updatedDto.jobTitle;
    delete updatedDto.preferredContactMethod;

    // Safely deletes the address property, since it is optional
    delete updatedDto.address;

    // this.logger.info('updatedDto: ' + JSON.stringify(updatedDto, null, 2) + '\n');

    this.update(updatedDto);
  }

  public onSaveAndClose() {

    this.logger.info('Contact Component: onSaveAndClose()');

    this.onSave();
    this.onClose();
  }

  //
  // Dynamic Form events
  //

  public onCustomEvent(event: any) {

    this.logger.info('Contact Component: onCustomEvent()');

  }

  /*

  public onCustomEvent(event: DynamicFormControlCustomEvent) {

    this.logger.info('Contact Component: onCustomEvent()');

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

    this.logger.info('Contact Component: openLookupAccountDialog()');

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

    this.logger.info('Contact Component: addAccount()');

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
        // this.generalInformationGroup.controls['organisation.displayName'].setValue(this.item.organisation.displayName);

      }

      subscription.unsubscribe();

    });

  }

  private removeAccount(): void {

    this.logger.info('Contact Component: removeAccount()');

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
          // this.generalInformationGroup.controls['organisation.displayName'].setValue('');

          subscription.unsubscribe();

        });

        return false;
      }

      return true;

    });

  }

  private update(dto: any): void {

    this.logger.info('Contact Component: update()');

    // adapter: contact.ts
    // Encode the id, for example http://localhost:4200/customers/contacts/MTYy
    // contact.id = btoa(item.id);

    // item.ts
    // Decode the identity, MTYy -> 162
    // this.id = atob(identity);

    // id: 162 item id: MTYy
    this.item = dto;
    this.item.id = this.id;

    this.logger.info('id: ' + this.id + ' item id: ' + this.item.id);
    this.logger.info('item: ' + JSON.stringify(this.item, null, 2) + '\n');

    const subscription: Subscription = this.entityService.update(this.id, this.item).subscribe(() => {

      // this.openSnackBar();

      subscription.unsubscribe();

    });

  }

  //
  // Misc events
  //

  public onMapReady(map: Map): void {

    this.logger.info('Contact Component: onMapReady()');

    this.map = map;
  }

  public onTabChanged($event: any) {

    this.logger.info('ContactComponent: onTabChanged()');

    this.selectedTabIndex = $event.index;

    this.logger.info('selectedTabIndex: ' + this.selectedTabIndex);

    if (this.selectedTabIndex === Tab.ELECTORAL_DIVISION && this.item !== undefined && this.item.electorate) {

      // this.isLoading = true;

      const electoralDivisionSubscription: Subscription = this.electoralDivisionsService.findByName(this.item.electorate).subscribe(

        (response: any) => {

          // this.electoralDivision = data;
          this.electoralDivision = response.body;

          this.logger.info('Electoral Division: ' + JSON.stringify(this.electoralDivision, null, 2) + '\n');

          let latitude = parseFloat(this.electoralDivision.latitude);
          let longitude = parseFloat(this.electoralDivision.longitude);

          this.logger.info('latitude: ' +  latitude + ' longitude: ' + longitude );

          if (isNaN(latitude)) {
            latitude = DEFAULT_LATITUDE;
          }

          if (isNaN(longitude)) {
            longitude = DEFAULT_LONGITUDE;
          }

          this.logger.info('latitude: ' +  latitude + ' longitude: ' + longitude );

          if (this.map !== undefined) {
            this.map.setView(latLng(latitude, longitude), DEFAULT_ZOOM);
            this.map.invalidateSize();
          }

          // this.isLoading = false;

          // this.detectChanges();

        });

      this.subscriptions.push(electoralDivisionSubscription);

    }

  }

  //
  // Misc
  //

  /**
   * Recursively updates fields in the target DTO with matching values from the form data.
   * Explicitly maps a flat form 'address' object to a matching entry in the DTO's 'party.addresses' array.
   *
   * @param dto The original target DTO object
   * @param formData The data snapshot extracted from the form
   * @returns The patched DTO object
   */
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

}

/*

  public patchDtoWithFormData(dto: any, formData: any): any {

    // If either input is invalid or not an object, stop processing
    if (!dto || !formData || typeof dto !== 'object' || typeof formData !== 'object') {
      return dto;
    }

    // Iterate over every field returned by the form
    Object.keys(formData).forEach(key => {
      // 1. Check if the key exists in the DTO
      if (key in dto) {
        const formValue = formData[key];
        const dtoValue = dto[key];

        // 2. Handle nested objects recursively (ignoring arrays or nulls)
        if (
          formValue && typeof formValue === 'object' && !Array.isArray(formValue) &&
          dtoValue && typeof dtoValue === 'object' && !Array.isArray(dtoValue)
        ) {
          this.patchDtoWithFormData(dtoValue, formValue);
        }
        // 3. Directly assign primitive values
        else {
          dto[key] = formValue;
        }
      }
    });

    return dto;
  }

*/
