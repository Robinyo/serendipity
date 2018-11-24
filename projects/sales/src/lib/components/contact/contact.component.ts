import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { Subscription} from 'rxjs';
import { tap } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material';

import { DynamicFormModel, DynamicFormService } from 'dynamic-forms';

import { ContactsService } from '../../services/contacts/contacts.service';
import { Contact } from '../../shared/models';

import { GENERAL_INFORMATION_GROUP, ADDRESS_INFORMATION_GROUP } from '../../shared/filenames';

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
} from '../../shared/constants';

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

  subscriptions: Subscription[] = [];

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
          this.dynamicFormService.initGroup(this.addressInformationGroup, this.item);
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

  //
  // Command Bar events
  //

  public onNew() {

    this.logger.info('ContactPage: onNew()');

    // btoa(0) === 'MA=='
    this.router.navigate(['sales/contacts/MA==']);
  }

  public onSave() {

    this.logger.info('ContactPage: onSave()');

    /*

    this.snackBar.open('Contact saved', '', {
      duration: 2000,
      panelClass: ['crm-snackbar-green']
    });

    */

    this.openSnackBar();
  }

  public onSaveAndClose() {

    this.logger.info('ContactPage: onSaveAndClose()');

    this.router.navigate(['sales/contacts']);
  }

  public onCustomEvent($event) {

    this.logger.info('ContactPage: onCustomEvent()');
  }

  private openSnackBar() {

    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 500,
      panelClass: 'crm-snack-bar-green'
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
