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

import { CONTACTS } from '../../models/constants';
import { CONTACT_ADDRESS_INFORMATION_GROUP, CONTACT_GENERAL_INFORMATION_GROUP } from '../../models/form-ids';

@Component({
  selector: 'sales-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent extends ItemComponent<Contact> {

  public generalInformationModel: DynamicFormModel;
  public generalInformationGroup: FormGroup;

  public addressInformationModel: DynamicFormModel;
  public addressInformationGroup: FormGroup;

  public mapOptions: MapOptions;
  public mapLayersControl: MapLayersControl;

  private map: Map;

  constructor(route: ActivatedRoute,
              private entityService: ContactsService,
              private dynamicFormService: DynamicFormService) {

    super(route);

    this.mapOptions = {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        })
      ],
      zoom: 4,
      center: latLng([ -33.865143, 151.209900 ])
    };

  }

  protected async subscribe() {

    this.logger.info('ContactComponent: subscribe()');

    this.generalInformationModel = await this.dynamicFormService.getFormMetadata(CONTACT_GENERAL_INFORMATION_GROUP);
    this.generalInformationGroup = this.dynamicFormService.createGroup(this.generalInformationModel);

    this.addressInformationModel = await this.dynamicFormService.getFormMetadata(CONTACT_ADDRESS_INFORMATION_GROUP);
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

    this.logger.info('contact: ' + JSON.stringify(this.item, null, 2) + '\n');

    this.update();
  }

  public onSaveAndClose() {

    this.logger.info('ContactComponent: onSaveAndClose()');

    this.onSave();
    this.onClose();
  }

  onTabChanged($event) {

    this.logger.info('ContactComponent: onTabChanged()');

    if (this.map !== undefined) {
      this.map.invalidateSize();
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

    const subscription: Subscription = this.entityService.update(this.item.party.id, this.item).subscribe(response => {

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
