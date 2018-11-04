import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Subscription} from 'rxjs';

import { FormMetadataService } from '../../services/form/form-metadata.service';
import { DynamicFormControlModel, DynamicFormLayout, DynamicFormService } from '@ng-dynamic-forms/core';

import { MATERIAL_SAMPLE_FORM_LAYOUT } from './individual-component-form.layout';

import { ContactsService } from '../../services/contacts/contacts.service';
import { Contact } from '../../shared/models';

import { LoggerService } from '../../services/logger/logger.service';

import {
  MARGIN_DESKTOP,
  TOOLBAR_HEIGHT_DESKTOP
} from '../../shared/constants';

@Component({
  selector: 'sales-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.scss']
})
export class IndividualComponent implements AfterViewInit, OnInit, OnDestroy {

  public containerHeight: number;

  public id: string;

  public item: Contact;

  protected formSubscription: Subscription;
  protected modelSubscription: Subscription;

  @ViewChild('contentContainer')
  private tableContainer: ElementRef;

  // formModel: DynamicFormModel = [];
  formModel: DynamicFormControlModel[] = [];
  formGroup: FormGroup;
  formLayout: DynamicFormLayout = MATERIAL_SAMPLE_FORM_LAYOUT;

  private toolbarHeight = TOOLBAR_HEIGHT_DESKTOP;
  private margin = MARGIN_DESKTOP;

  constructor(private route: ActivatedRoute,
              private contactsService: ContactsService,
              private formMetadataService: FormMetadataService,
              private dynamicFormService: DynamicFormService,
              private logger: LoggerService) { }

  public ngOnInit() {

    this.logger.info('IndividualComponent: ngOnInit()');

    this.id = this.route.snapshot.paramMap.get('id');
    this.id = atob(this.id);

    this.containerHeight = this.tableContainer.nativeElement.offsetHeight - (this.toolbarHeight * 2 + this.margin);

    this.createForm();
  }

  protected createForm(): void {

    this.logger.info('IndividualComponent: createForm()');

    this.formSubscription = this.formMetadataService.get('individual-form.model.json').subscribe(data => {

      this.formModel = this.dynamicFormService.fromJSON(data);
      this.formGroup = this.dynamicFormService.createFormGroup(this.formModel);
    });

  }

  protected initialiseForm(): void {

    this.logger.info('IndividualComponent: initialiseForm()');

    for (const field of Object.keys(this.formGroup.controls)) {

      // this.logger.info('field name: ' + field +
      //   ' nested object name: ' + field.replace('-', '.') +
      //   ' value: ' + this.getProperty(this.item, field));

      this.formGroup.controls[field].setValue(this.getProperty(this.item, field));
    }

  }

  public ngAfterViewInit() {

    this.logger.info('IndividualComponent: ngAfterViewInit()');
    this.subscribe();
  }

  protected subscribe() {

    this.logger.info('IndividualComponent: subscribe()');

    this.modelSubscription = this.contactsService.get(this.id).subscribe(data => {

      this.item = data;
      this.logger.info('this.item: ' + JSON.stringify(this.item));
      this.initialiseForm();
    });

  }

  protected unsubscribe() {

    this.logger.info('IndividualComponent: unsubscribe()');

    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }

    if (this.modelSubscription) {
      this.modelSubscription.unsubscribe();
    }

  }

  public ngOnDestroy() {

    this.logger.info('IndividualComponent: ngOnDestroy()');
    this.unsubscribe();
  }

  getProperty = (obj, path) => (
    path.split('-').reduce((o, p) => o && o[p], obj)
  )

}

// https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding


/*

  for (const field of Object.keys(this.formGroup.controls)) {

    this.logger.info('field name: ' + field +
      ' nested object name: ' + field.replace('-', '.') +
      ' value: ' + this.getProperty(this.item, field.replace('-', '.')));
  }

  for (const field of Object.keys(this.formGroup.controls)) {

    this.logger.info('field name: ' + field +
      ' nested object name: ' + field.replace('-', '.') +
      ' value: ' + this.item[field.replace('-', '.')]);
    // this.formGroup.controls[field].setValue(this.item[field.replace('-', '.')]);
  }

*/

/*

ViewEncapsulation
  // encapsulation: ViewEncapsulation.None


      // this.logger.info('this.formModel: ' + JSON.stringify(this.formModel));

  cards = [
    { title: 'Contact Information', cols: 2, rows: 1 },
    { title: 'Personal Details', cols: 2, rows: 1 }
  ];

      // this.logger.info('this.item: ' + JSON.stringify(this.item));

  // formModel: DynamicFormControlModel[] = MATERIAL_SAMPLE_FORM_MODEL;
  //  formGroup: FormGroup;
  // formLayout: DynamicFormLayout = MATERIAL_SAMPLE_FORM_LAYOUT;

// import { Location } from '@angular/common';

DynamicFormLayout

import { MATERIAL_SAMPLE_FORM_MODEL } from './individual-component-form.model';
import { MATERIAL_SAMPLE_FORM_LAYOUT } from './individual-component-form.layout';

  cards = this.breakpointObserver.observe(Breakpoints.HandsetPortrait).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Contact Information', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Contact Information', cols: 2, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );

*/
