import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Subscription} from 'rxjs';
import { tap } from 'rxjs/operators';

import { DynamicFormModel, DynamicFormMetadataService } from 'dynamic-forms';

import { ContactsService } from '../../services/contacts/contacts.service';
import { Contact } from '../../shared/models';

import { GENERAL_INFORMATION_GROUP, ADDRESS_INFORMATION_GROUP } from '../../shared/filenames';

import { LoggerService } from 'utils';

import {
  MARGIN_DESKTOP,
  TOOLBAR_HEIGHT_DESKTOP
} from '../../shared/constants';

@Component({
  selector: 'sales-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {

  public containerHeight: number;

  public id: string;
  public item: Contact;

  subscriptions: Subscription[] = [];

  @ViewChild('contentContainer')
  private tableContainer: ElementRef;

  // formGroup: FormGroup;
  public generalInformationGroup: FormGroup;
  public generalInformationModel: DynamicFormModel; // DynamicFormControlModel[] = [];

  public addressInformationGroup: FormGroup;
  public addressInformationModel: DynamicFormModel; // === DynamicFormControlModel[] = [];

  private toolbarHeight = TOOLBAR_HEIGHT_DESKTOP;
  private margin = MARGIN_DESKTOP;

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private contactsService: ContactsService,
              private dynamicFormMetadataService: DynamicFormMetadataService,
              private logger: LoggerService) { }

  public ngOnInit() {

    this.logger.info('ContactComponent: ngOnInit()');

    this.id = this.route.snapshot.paramMap.get('id');
    this.id = atob(this.id);

    this.containerHeight = this.tableContainer.nativeElement.offsetHeight - (this.toolbarHeight * 2 + this.margin);

    this.subscribe();
  }

  protected subscribe() {

    this.logger.info('ContactComponent: subscribe()');

    let formSubscription: Subscription = new Subscription();
    this.subscriptions.push(formSubscription);

    // General Information

    formSubscription = this.dynamicFormMetadataService.get(GENERAL_INFORMATION_GROUP).pipe(tap(() => {

        let modelSubscription: Subscription = new Subscription();
        this.subscriptions.push(modelSubscription);

        modelSubscription = this.contactsService.get(this.id).subscribe(data => {
          this.item = data;
          this.initFormGroup(this.generalInformationGroup);
        });

    })).subscribe(metaData => {

      this.generalInformationModel = metaData;
      this.generalInformationGroup = this.createFormGroup(this.generalInformationModel);
    });

    // Address Information

    formSubscription = new Subscription();
    this.subscriptions.push(formSubscription);

    formSubscription = this.dynamicFormMetadataService.get(ADDRESS_INFORMATION_GROUP).pipe(tap(() => {

      let modelSubscription: Subscription = new Subscription();
      this.subscriptions.push(modelSubscription);

      modelSubscription = this.contactsService.get(this.id).subscribe(data => {
        this.item = data;
        this.initFormGroup(this.addressInformationGroup);
      });

    })).subscribe(metaData => {

      this.addressInformationModel = metaData;
      this.addressInformationGroup = this.createFormGroup(this.addressInformationModel);
    });

  }

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

  getProperty = (obj, path) => (
    path.split('-').reduce((o, p) => o && o[p], obj)
  )

}

// https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding

/*

  protected subscribe() {

    this.logger.info('ContactComponent: subscribe()');

    this.formSubscription = this.dynamicFormMetadataService.get(GENERAL_INFORMATION_GROUP).pipe(tap(() =>

        this.modelSubscription = this.contactsService.get(this.id).subscribe(data => {
          this.item = data;
          this.initialiseForm();
        })
      )
    ).subscribe(metaData => {

      this.generalInformationModel = metaData;
      this.generalInformationGroup = this.createFormGroup(this.generalInformationModel);
    });

  }

  protected initialiseForm(): void {

    this.logger.info('ContactComponent: initialiseForm()');

    for (const field of Object.keys(this.generalInformationGroup.controls)) {

      // this.logger.info('field name: ' + field +
      //   ' nested object name: ' + field.replace('-', '.') +
      //   ' value: ' + this.getProperty(this.item, field));

      this.generalInformationGroup.controls[field].setValue(this.getProperty(this.item, field));
    }

  }

  protected unsubscribe(): void {

    this.logger.info('ContactComponent: unsubscribe()');

    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }

    if (this.modelSubscription) {
      this.modelSubscription.unsubscribe();
    }

  }

*/

/*

protected subscribe() {

  this.logger.info('ContactComponent: subscribe()');

  this.formSubscription = this.dynamicFormMetadataService.get('contact-form.model.json').subscribe(data => {

    this.formModel = data;
    this.formGroup = this.createFormGroup(this.formModel);
  });

}

*/

/*

this.formMetadata.forEach(control => {

  this.formGroup.addControl(control.id, new FormControl(''));
});

const group = this.fb.group({});
this.config.forEach(control => group.addControl(control.name, this.fb.control()));
return group;



    this.addressInformationGroup = this.formBuilder.group({
      streetNumber: [''],
      streetName: [''],
      city: [''],
      state: [''],
      postalCode: ['']
    });

this.formGroup = this.formBuilder.group({
  displayName: [''],
  title: [''],
  givenName: [''],
  middleName: [''],
  familyName: ['']
});

*/
