import { Component, inject, Input, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { LoggerService } from 'serendipity-utils-lib';

@Component({
  selector: 'collection-footer',
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="footer-container">

      <button id="{{ host.footerAllLabel }}" mat-button class="footer-button"
              (click)="host.onClickFilterButton(host.footerAllLabel)"
              [class.active]="host.selectedFooterItemId === host.footerAllLabel">
        {{ host.footerAllLabel }}
      </button>

      <button mat-button disabled class="footer-button">
        |
      </button>

      @for (character of host.alphabet; track $index) {

        <button id="{{ character }}" mat-button class="footer-button"
                (click)="host.onClickFilterButton(character)"
                [class.active]="host.selectedFooterItemId === character">
          {{ character }}
        </button>

      }

      <button mat-button disabled class="footer-button">
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
  standalone: true,
  styleUrls: ['footer.scss']
})
export class CollectionFooter implements OnInit {

  @Input() host: any;

  private logger: LoggerService = inject(LoggerService);

  public ngOnInit() {

    this.logger.info('Collection Footer Component: ngOnInit()');
  }

}
