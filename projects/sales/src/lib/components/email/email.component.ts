import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { DynamicFormControlCustomEvent, DynamicFormModel, DynamicFormService } from 'dynamic-forms';

import { Email } from '../../models/email';

// import { EmailService } from '../../services/email/email.service';
// private emailService: EmailService

import { ACTIVITIES } from '../../models/constants';
import { EMAIL_GROUP } from '../../models/form-ids';

import { DialogService } from 'serendipity-components';

import { LoggerService } from 'utils';

@Component({
  selector: 'sales-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {

  public item: Email;

  public emailModel: DynamicFormModel;
  public emailGroup: FormGroup;

  constructor(private dialogService: DialogService,
              private dynamicFormService: DynamicFormService,
              private logger: LoggerService,
              private router: Router) {}

  ngOnInit() {

    this.logger.info('EmailComponent: ngOnInit()');

    this.subscribe();
  }

  protected async subscribe() {

    this.logger.info('ContactComponent: subscribe()');

    this.emailModel = await this.dynamicFormService.getFormMetadata(EMAIL_GROUP);
    this.emailGroup = this.dynamicFormService.createGroup(this.emailModel);

    this.item = new Email(
      'hey@serendipity.org.au',
      'someone@gmail.com',
      'Hey',
      'Hello from Serendipity CEP'
    );

    this.dynamicFormService.initGroup(this.emailGroup, this.item);

  }

  //
  // Misc
  //

  public canDeactivate(): Observable<boolean> | boolean {

    return true;
  }

  //
  // Command Bar events
  //

  public onClose() {

    this.logger.info('EmailComponent: onClose()');

    this.router.navigate([ACTIVITIES]);
  }

  public onCustomEvent(event: DynamicFormControlCustomEvent) {

    this.logger.info('EmailComponent: onCustomEvent()');

    this.dialogService.openAlert({
      title: 'Alert',
      message: JSON.stringify(event),
      closeButton: 'CLOSE'
    });

    // this.logger.info('event: ' + JSON.stringify(event));
  }

  public onSend() {

    this.logger.info('EmailComponent: onSend()');
  }

}

// https://github.com/angular/components/issues/4597 Support multi-level density for all components

// https://material.angular.io/components/list/overview#dense-lists
// Lists are also available in "dense layout" mode, which shrinks the font size and height of the list to suit UIs that may need to
// display more information. To enable this mode, add a dense attribute to the main mat-list tag.

// https://stackoverflow.com/questions/48540533/styling-mat-form-field-input-in-angular-material
// https://stackoverflow.com/questions/56653507/how-to-customize-mat-form-field

// https://material.io/components/text-fields/#filled-text-field
