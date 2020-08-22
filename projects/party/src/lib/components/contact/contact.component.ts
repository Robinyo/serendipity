import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { DynamicFormControlCustomEvent, DynamicFormModel, DynamicFormService } from 'dynamic-forms';
import { ItemComponent, SnackBarComponent } from 'serendipity-components';

import { latLng, LatLng, LatLngBounds, Layer, LeafletEvent, LeafletMouseEvent, Map, MapOptions, tileLayer } from 'leaflet';

class LeafletControlLayersConfig {
  baseLayers: { [name: string]: Layer } = {};
  overlays: { [name: string]: Layer } = {};
}

// tslint:disable-next-line:no-empty-interface
class MapLayersControl extends LeafletControlLayersConfig {}

import { Contact } from '../../models/contact';
import { ContactsService } from '../../services/contacts/contacts.service';
import { ElectoralDivision } from '../../models/electoral-division';
import { ElectoralDivisionsService } from '../../services/electoral-divisions/electoral-divisions.service';

import { CONTACTS } from '../../models/constants';
import { CONTACT_ADDRESS_INFORMATION_GROUP, CONTACT_GENERAL_INFORMATION_GROUP } from '../../models/form-ids';

const DEFAULT_ZOOM = 13;
const DEFAULT_LATITUDE = -28.15;
const DEFAULT_LONGITUDE = 133.28;
const ELECTORAL_DIVISION_TAB_INDEX = 3;

@Component({
  selector: 'party-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent extends ItemComponent<Contact> {

  public generalInformationModel: DynamicFormModel;
  public generalInformationGroup: FormGroup;

  public addressInformationModel: DynamicFormModel;
  public addressInformationGroup: FormGroup;

  private electoralDivision: ElectoralDivision;

  public mapOptions: MapOptions;
  public mapLayersControl: MapLayersControl;

  private map: Map;

  constructor(route: ActivatedRoute,
              private entityService: ContactsService,
              private dynamicFormService: DynamicFormService,
              private electoralDivisionsService: ElectoralDivisionsService) {

    super(route);

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

  private getPhoto() {

  }

  protected async subscribe() {

    this.logger.info('ContactComponent: subscribe()');

    this.generalInformationModel = await this.dynamicFormService.getFormMetadata(CONTACT_GENERAL_INFORMATION_GROUP);
    this.generalInformationGroup = this.dynamicFormService.createGroup(this.generalInformationModel);

    this.addressInformationModel = await this.dynamicFormService.getFormMetadata(CONTACT_ADDRESS_INFORMATION_GROUP);
    this.addressInformationGroup = this.dynamicFormService.createGroup(this.addressInformationModel);

    let entitySubscription: Subscription = new Subscription();
    this.subscriptions.push(entitySubscription);

    entitySubscription = this.entityService.findById(this.id).subscribe(data => {

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

        const subscription: Subscription = this.entityService.delete(this.id).subscribe(() => {

          subscription.unsubscribe();
          this.router.navigate([CONTACTS]);
        });

      }

    });

  }

  public onMapReady(map: Map): void {

    this.logger.info('ContactComponent: onMapReady()');

    this.map = map;
  }

  public onNew() {

    this.logger.info('ContactComponent: onNew()');

    this.router.navigate([CONTACTS + '/new']);
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

  public async onTabChanged($event) {

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

    this.logger.info('ContactComponent: update()');

    // contact.id = btoa(item.id);
    // this.id = atob(this.id);
    this.item.id = this.id;

    this.logger.info('item: ' + JSON.stringify(this.item, null, 2) + '\n');

    const subscription: Subscription = this.entityService.update(this.id, this.item).subscribe(() => {

      this.markAsPristine();
      this.openSnackBar();

      subscription.unsubscribe();

    });

  }

}

/*

const keys = response.headers.keys();
keys.map(key => {
  this.logger.info('ContactComponent update() key: ' + response.headers.get(key));
});

this.item = { ...response.body };

this.logger.info('contact: ' + JSON.stringify(this.item, null, 2) + '\n');

*/
