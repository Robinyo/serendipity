import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Subscription} from 'rxjs';

import { FormMetadataService } from '../../services/form/form-metadata.service';

import { ContactsService } from '../../services/contacts/contacts.service';
import { Contact } from '../../shared/models';

import { LoggerService } from '../../services/logger/logger.service';

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

  protected formSubscription: Subscription;
  protected modelSubscription: Subscription;

  @ViewChild('contentContainer')
  private tableContainer: ElementRef;

  // formModel: DynamicFormModel = [];
  // formModel: DynamicFormControlModel[] = [];
  formGroup: FormGroup;

  private toolbarHeight = TOOLBAR_HEIGHT_DESKTOP;
  private margin = MARGIN_DESKTOP;

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private contactsService: ContactsService,
              private formMetadataService: FormMetadataService,
              private logger: LoggerService) { }

  public ngOnInit() {

    this.logger.info('ContactComponent: ngOnInit()');

    this.id = this.route.snapshot.paramMap.get('id');
    this.id = atob(this.id);

    this.containerHeight = this.tableContainer.nativeElement.offsetHeight - (this.toolbarHeight * 2 + this.margin);

    this.createFormGroup();
  }

  protected createFormGroup(): void {

    this.formGroup = this.formBuilder.group({
      displayName: [''],
      title: [''],
      givenName: [''],
      middleName: [''],
      familyName: ['']
    });

  }

  protected unsubscribe() {

    this.logger.info('ContactComponent: unsubscribe()');

    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }

    if (this.modelSubscription) {
      this.modelSubscription.unsubscribe();
    }

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
