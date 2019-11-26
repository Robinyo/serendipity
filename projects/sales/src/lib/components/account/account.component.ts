import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { MatSnackBar } from '@angular/material';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';

import { DynamicFormControlCustomEvent, DynamicFormModel, DynamicFormService } from 'dynamic-forms';

// import { ContactsService } from '../../services/contacts/contacts.service';
// import { Contact } from '../../models/contact';
import { Organisation } from '../../models/organisation';

import { ACCOUNTS } from '../../models/constants';
import { CONTACTS } from '../../models/constants';
// import { GENERAL_INFORMATION_GROUP, ADDRESS_INFORMATION_GROUP } from '../../models/form-ids';

import { DialogService } from 'serendipity-components';

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
} from '../../models/constants';

@Component({
  selector: 'sales-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {

  public containerHeight: number;

  // public id = 'MA==';
  public partyId: string;
  public item: Organisation;

  protected subscriptions: Subscription[] = [];

  @ViewChild('contentContainer', {static: true})
  private tableContainer: ElementRef;

  // public generalInformationModel: DynamicFormModel; // DynamicFormControlModel[] = [];
  // public generalInformationGroup: FormGroup;

  // public addressInformationModel: DynamicFormModel; // DynamicFormControlModel[] = [];
  // public addressInformationGroup: FormGroup;

  private navBarHeight = NAVIGATION_BAR_HEIGHT_DESKTOP;
  private cmdBarHeight = COMMAND_BAR_HEIGHT_DESKTOP;
  private viewBarHeight = VIEW_BAR_HEIGHT_DESKTOP;
  private margin = MARGIN_DESKTOP;

  constructor(private route: ActivatedRoute,
              private router: Router,
              // private contactsService: ContactsService,
              private dynamicFormService: DynamicFormService,
              private dialogService: DialogService,
              private snackBar: MatSnackBar,
              private logger: LoggerService) { }

  public ngOnInit() {

    this.logger.info('AccountComponent: ngOnInit()');

    this.containerHeight = this.tableContainer.nativeElement.offsetHeight -
      (this.navBarHeight + this.cmdBarHeight + this.viewBarHeight + this.margin);

    // this.partyId = this.route.snapshot.paramMap.get('id');

    let paramSubscription: Subscription = new Subscription();
    this.subscriptions.push(paramSubscription);

    paramSubscription = this.route.paramMap.subscribe(params =>  {

      this.partyId = params.get('id');
      this.partyId = atob(this.partyId);

      this.subscribe();

    });

  }

  async subscribe() {

    this.logger.info('AccountComponent: subscribe()');

  }

  protected unsubscribe(): void {

    this.logger.info('AccountComponent: unsubscribe()');

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

  }

  public ngOnDestroy() {

    this.logger.info('AccountComponent: ngOnDestroy()');
    this.unsubscribe();
  }

  //
  // Misc
  //

  public canDeactivate(): Observable<boolean> | boolean {

    // this.logger.info('AccountComponent: canDeactivate()');

    if (!this.isDirty() && this.isValid()) {
      return true;
    }

    return this.dialogService.openConfirm({
      title: 'Account',
      message: 'Are you sure you want to leave this page?',
      acceptButton: 'OK',
      cancelButton: 'CANCEL'
    }).afterClosed();

  }

  public isDirty() {

    // this.logger.info('AccountComponent - isDirty()');

    // let dirty = false;
    const dirty = false;

    // if ((this.generalInformationGroup && this.generalInformationGroup.dirty) ||
    //   (this.addressInformationGroup && this.addressInformationGroup.dirty)) {
    //   dirty = true;
    // }

    return dirty;
  }

  public isValid() {

    // this.logger.info('AccountComponent - isValid()');

    // let valid = false;
    const valid = false;

    // if (this.generalInformationGroup && this.generalInformationGroup.valid) {
    //   if (this.addressInformationGroup && this.addressInformationGroup.valid) {
    //     valid = true;
    //   }
    // }

    return valid;
  }

  public markAsPristine() {

    // this.logger.info('AccountComponent - markAsPristine()');

    // if (this.generalInformationGroup) {
    //   this.generalInformationGroup.markAsPristine();
    // }

    // if (this.addressInformationGroup) {
    //   this.addressInformationGroup.markAsPristine();
    // }

  }

  //
  // Command Bar events
  //

  public onNew() {

    this.logger.info('AccountComponent: onNew()');

    this.router.navigate([ACCOUNTS + '/new']);
  }

  public onSave() {

    this.logger.info('AccountComponent: onSave()');

    this.markAsPristine();
    this.openSnackBar();
  }

  public onSaveAndClose() {

    this.logger.info('AccountComponent: onSaveAndClose()');

    this.markAsPristine();
    this.openSnackBar();
    this.router.navigate([CONTACTS]);
  }

  public onDeactivate() {

    this.logger.info('AccountComponent: onDeactivate()');

    this.dialogService.openConfirm({
      title: 'Contact',
      message: 'Are you sure you want to delete this contact?',
      acceptButton: 'OK',
      cancelButton: 'CANCEL'
    }).afterClosed().subscribe(response => {

      // this.logger.info(`ContactPage onDeactivate() response: ${response}`);

      if (response) {

        this.logger.info('AccountComponent onDeactivate() response: true');

        // const subscription: Subscription = this.contactsService.delete(this.partyId).subscribe(() => {
        //   subscription.unsubscribe();
        //   this.router.navigate([CONTACTS]);
        // });

      }

    });

  }

  public onClose() {

    this.logger.info('AccountComponent: onClose()');

    this.router.navigate([CONTACTS]);
  }


  public onCustomEvent(event: DynamicFormControlCustomEvent) {

    this.logger.info('AccountComponent: onCustomEvent()');

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
