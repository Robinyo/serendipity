import { Component, Input, OnInit } from '@angular/core';

import { LoggerService } from 'utils-lib';

@Component({
  selector: 'paginated-footer',
  template: `
    <div class="footer-container">

      <span class="footer-spacer"></span>

      <div>

        <button mat-button class="footer-button-first-page"
                [disabled]="!host.canClickFirstPageButton()"
                (click)="host.onClickFirstPageButton()">
          <mat-icon>skip_previous</mat-icon>
          <!-- <mat-icon svgIcon="skip-previous"> </mat-icon> -->
        </button>

        <button mat-button class="footer-button-previous-page"
                [disabled]="!host.canClickPreviousPageButton()"
                (click)="host.onClickPreviousPageButton()">
          <mat-icon>keyboard_arrow_left</mat-icon>
          <!-- <mat-icon svgIcon="keyboard-arrow-left"> </mat-icon> -->
        </button>

        <span class="footer-page-number">
                Page {{ host.pageNumber }}
              </span>

        <button mat-button class="footer-button-next-page"
                [disabled]="!host.canClickNextPageButton()"
                (click)="host.onClickNextPageButton()">
          <mat-icon>keyboard_arrow_right</mat-icon>
          <!-- <mat-icon svgIcon="keyboard-arrow-right"> </mat-icon> -->
        </button>

      </div>

    </div>
  `,
  styleUrls: ['../footer-styles.scss']
})
export class PaginatedFooterComponent implements OnInit {

  @Input() host: any;

  constructor(private logger: LoggerService) {}

  public ngOnInit() {

    this.logger.info('PaginatedFooterComponent: ngOnInit()');
  }

}
