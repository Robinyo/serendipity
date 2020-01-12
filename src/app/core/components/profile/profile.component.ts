import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import {
  NAVIGATION_BAR_HEIGHT_DESKTOP,
  NAVIGATION_BAR_HEIGHT_MOBILE,
  COMMAND_BAR_HEIGHT_DESKTOP,
  COMMAND_BAR_HEIGHT_MOBILE,
  VIEW_BAR_HEIGHT_DESKTOP,
  VIEW_BAR_HEIGHT_MOBILE,
  MARGIN_DESKTOP,
  MARGIN_MOBILE
} from 'serendipity-components';

import { LoggerService } from 'utils';

@Component({
  selector: 'crm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {

  public containerHeight: number;

  public item: null;

  protected subscriptions: Subscription[] = [];

  @ViewChild('contentContainer', {static: true})
  private itemContainer: ElementRef;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private breakpointObserver: BreakpointObserver,
              private logger: LoggerService) {}

  public ngOnInit() {

    this.logger.info('ProfileComponent: ngOnInit()');

    // this.containerHeight = this.itemContainer.nativeElement.offsetHeight -
    //  (NAVIGATION_BAR_HEIGHT_DESKTOP + COMMAND_BAR_HEIGHT_DESKTOP + VIEW_BAR_HEIGHT_DESKTOP + MARGIN_DESKTOP);
  }

  public ngAfterViewInit() {

    this.logger.info('ProfileComponent: ngAfterViewInit()');

    // React to changes to the viewport

    this.breakpointObserver.observe([ Breakpoints.HandsetPortrait ]).subscribe(result => {

      if (result.matches) {

        this.containerHeight = this.itemContainer.nativeElement.offsetHeight -
          (NAVIGATION_BAR_HEIGHT_MOBILE + COMMAND_BAR_HEIGHT_MOBILE + VIEW_BAR_HEIGHT_MOBILE + MARGIN_MOBILE);

      } else {

        this.containerHeight = this.itemContainer.nativeElement.offsetHeight -
          (NAVIGATION_BAR_HEIGHT_DESKTOP + COMMAND_BAR_HEIGHT_DESKTOP + VIEW_BAR_HEIGHT_DESKTOP + MARGIN_DESKTOP);
      }

    });

  }

  protected unsubscribe(): void {

    this.logger.info('ProfileComponent: unsubscribe()');

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public ngOnDestroy() {

    this.logger.info('ProfileComponent: ngOnDestroy()');
    this.unsubscribe();
  }

  //
  // Validation
  //

  public isDirty() {

    // this.logger.info('ProfileComponent - isDirty()');

    return false;
  }

  public isValid() {

    // this.logger.info('ProfileComponent - isValid()');

    return true;
  }

  //
  // Command Bar events
  //

  public onClose() {

    this.logger.info('ProfileComponent: onClose()');

    this.router.navigate(['/']);
  }

  public onSave() {

    this.logger.info('ProfileComponent: onSave()');

    this.update();
  }

  public onSaveAndClose() {

    this.logger.info('ProfileComponent: onSaveAndClose()');

    this.onSave();
    this.onClose();
  }

  //
  // Misc
  //

  private update() {

    this.logger.info('ProfileComponent: onSaveAndClose()');

    // this.markAsPristine();
  }

}
