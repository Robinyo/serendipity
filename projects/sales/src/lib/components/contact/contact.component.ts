import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material';

import { DynamicFormControlCustomEvent, DynamicFormModel, DynamicFormService } from 'dynamic-forms';

import { ContactsService } from '../../services/contacts/contacts.service';
import { Contact } from '../../models/models';

import { CONTACTS } from '../../models/constants';
import { GENERAL_INFORMATION_GROUP, ADDRESS_INFORMATION_GROUP } from '../../models/form-ids';

import { LoggerService } from 'utils';

import { DialogService } from 'serendipity-components';

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

  public newContact = false;
  public id = 'MA==';
  public item: Contact;

  protected subscriptions: Subscription[] = [];

  @ViewChild('contentContainer')
  private tableContainer: ElementRef;

  // formGroup: FormGroup;
  public generalInformationGroup: FormGroup;
  public generalInformationModel: DynamicFormModel; // DynamicFormControlModel[] = [];

  public addressInformationGroup: FormGroup;
  public addressInformationModel: DynamicFormModel; // DynamicFormControlModel[] = [];

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
              private logger: LoggerService) { }

  public ngOnInit() {

    this.logger.info('ContactComponent: ngOnInit()');

    this.containerHeight = this.tableContainer.nativeElement.offsetHeight -
      (this.navBarHeight + this.cmdBarHeight + this.viewBarHeight + this.margin);

    // this.id = this.route.snapshot.paramMap.get('id');

    let paramSubscription: Subscription = new Subscription();
    this.subscriptions.push(paramSubscription);

    paramSubscription = this.route.paramMap.subscribe(params =>  {

      this.id = params.get('id');
      this.id = atob(this.id);

      if (this.id === '0') {
        this.newContact = true;
      }

      this.subscribe();

    });

  }

  protected subscribe() {

    this.logger.info('ContactComponent: subscribe()');

    let formSubscription: Subscription = new Subscription();
    this.subscriptions.push(formSubscription);

    // General Information

    formSubscription = this.dynamicFormService.getFormMetadata(GENERAL_INFORMATION_GROUP).pipe(tap(() => {

      if (! this.newContact) {

        let modelSubscription: Subscription = new Subscription();
        this.subscriptions.push(modelSubscription);

        modelSubscription = this.contactsService.get(this.id).subscribe(data => {

          this.item = data;
          this.dynamicFormService.initGroup(this.generalInformationGroup, this.item);
          // this.dynamicFormService.initGroup(this.addressInformationGroup, this.item);
          this.dynamicFormService.initGroup(this.addressInformationGroup, this.item.addresses[0]);
        });

      }

    })).subscribe(metaData => {

      this.generalInformationModel = metaData;
      this.generalInformationGroup = this.dynamicFormService.createGroup(this.generalInformationModel);
    });

    // Address Information

    formSubscription = new Subscription();
    this.subscriptions.push(formSubscription);

    formSubscription = this.dynamicFormService.getFormMetadata(ADDRESS_INFORMATION_GROUP).pipe(tap(() => {

      if (this.newContact) {

        this.logger.info('ContactComponent: subscribe() - this.item = {} as Contact');
        this.item = {} as Contact;
      }

      /*

      let modelSubscription: Subscription = new Subscription();
      this.subscriptions.push(modelSubscription);

      modelSubscription = this.contactsService.get(this.id).subscribe(data => {
        this.item = data;
        this.dynamicFormService.initGroup(this.addressInformationGroup, this.item);
      });

      */

      /*

      if (this.item) {
        this.dynamicFormService.initGroup(this.addressInformationGroup, this.item);
      }

      */

    })).subscribe(metaData => {

      this.addressInformationModel = metaData;
      this.addressInformationGroup = this.dynamicFormService.createGroup(this.addressInformationModel);
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
  // Misc
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

  public onNew() {

    this.logger.info('ContactPage: onNew()');

    this.router.navigate([CONTACTS + '/MA==']);
  }

  public onSave() {

    this.logger.info('ContactPage: onSave()');

    this.markAsPristine();
    this.openSnackBar();
  }

  public onClose() {

    this.logger.info('ContactPage: onClose()');

    this.router.navigate([CONTACTS]);
  }

  public onSaveAndClose() {

    this.logger.info('ContactPage: onSaveAndClose()');

    this.markAsPristine();
    this.openSnackBar();
    this.router.navigate([CONTACTS]);
  }

  public onCustomEvent(event: DynamicFormControlCustomEvent) {

    this.logger.info('ContactPage: onCustomEvent()');

    this.dialogService.openAlert({
      title: 'Alert',
      message: JSON.stringify(event),
      closeButton: 'CLOSE'
    });

    // this.logger.info('event: ' + JSON.stringify(event));
  }

  private openSnackBar() {

    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 500,
      panelClass: 'crm-snack-bar'
    });

  }

}

@Component({
  selector: 'sales-toast',
  template: `
    <span>
      Contact saved
    </span>
  `,
  styles: []
})
export class SnackBarComponent {}

// https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding

/*

    this.dialogService.openConfirm({
      title: 'Contact',
      message: 'Leave this page?',
      acceptButton: 'OK',
      cancelButton: 'CANCEL'
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        this.router.navigate([CONTACTS]);
      }
    });

*/

/*

this.snackBar.open('Contact saved', '', {
  duration: 2000,
  panelClass: ['crm-snack-bar']
});

*/

// this.newContact = (this.route.snapshot.paramMap.get('new') === 'true');
// this.logger.info('ContactComponent: ngOnInit() - newContact: ' + this.newContact);

// import { Location } from '@angular/common';
// private location: Location,
// this.location.back();

/*

if (this.generalInformationGroup && !this.generalInformationGroup.touched) {

  valid = false;
  this.logger.info('valid: ' + valid);
}

*/

/*

  public onSave() {

    this.logger.info('ContactsPage: onSave()');

    this.snackBar.open('Contact saved', '', {
      duration: 2000,
      panelClass: ['crm-snackbar-green']
    });
  }

    this.snackBar.open('Contact saved', 'X', {
      duration: 2000,
      panelClass: ['crm-snackbar-green']
    });


    // this.router.navigate(['sales/contacts']);

        this.item = {} as Contact;

  // https://angular.io/api/forms/FormControl

  protected createFormGroup(formModel: DynamicFormModel): FormGroup {

    const group = this.formBuilder.group({});

    this.logger.info('ContactComponent: createFormGroup()');

    formModel.forEach(control => {
      group.addControl(control.id, new FormControl(''));
    });

    return group;
  }

  protected initFormGroup(formGroup: FormGroup): void {

    this.logger.info('ContactComponent: initialiseForm()');

    for (const field of Object.keys(formGroup.controls)) {

      // this.logger.info('field name: ' + field +
      //   ' nested object name: ' + field.replace('-', '.') +
      //   ' value: ' + this.getProperty(this.item, field));

      formGroup.controls[field].setValue(this.getProperty(this.item, field));
    }

  }

  getProperty = (obj, path) => (
    path.split('-').reduce((o, p) => o && o[p], obj)
  )

*/
