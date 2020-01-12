import { Component, Input, OnInit } from '@angular/core';

import { LoggerService } from 'utils';

@Component({
  selector: 'sales-collection-footer',
  template: `
    <div class="footer-container">

      <button id="{{ host.footerAllLabel }}" mat-button class="footer-button"
              (click)="host.onClickFilterButton(host.footerAllLabel)"
              [class.active]="host.selectedFooterItemId === host.footerAllLabel">
        {{ host.footerAllLabel }}
      </button>

      <button mat-button disabled class="footer-button" fxHide.xs>
        |
      </button>

      <div *ngFor="let character of host.alphabet" fxHide.xs>
        <button id="{{ character }}" mat-button class="footer-button"
                (click)="host.onClickFilterButton(character)"
                [class.active]="host.selectedFooterItemId === character">
          {{ character }}
        </button>
      </div>

      <button mat-button disabled class="footer-button" fxHide.xs>
        |
      </button>

      <div>

        <button mat-button class="footer-button-first-page"
                [disabled]="!host.canClickFirstPageButton()"
                (click)="host.onClickFirstPageButton()">
          <mat-icon>skip_previous</mat-icon>
        </button>

        <button mat-button class="footer-button-previous-page"
                [disabled]="!host.canClickPreviousPageButton()"
                (click)="host.onClickPreviousPageButton()">
          <mat-icon>keyboard_arrow_left</mat-icon>
        </button>

        <span class="footer-page-number">
                Page {{ host.pageNumber }}
              </span>

        <button mat-button class="footer-button-next-page"
                [disabled]="!host.canClickNextPageButton()"
                (click)="host.onClickNextPageButton()">
          <mat-icon>keyboard_arrow_right</mat-icon>
        </button>

      </div>

    </div>
  `,
  styleUrls: ['./collection-footer.component.scss']
})
export class CollectionFooterComponent implements OnInit {

  @Input() host: any;

  constructor(private logger: LoggerService) {}

  public ngOnInit() {

    this.logger.info('CollectionFooterComponent: ngOnInit()');
  }

}
