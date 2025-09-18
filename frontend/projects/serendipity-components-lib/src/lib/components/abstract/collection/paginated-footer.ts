import {Component, inject, Input, OnInit} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { LoggerService } from 'serendipity-utils-lib';

@Component({
  selector: 'paginated-footer',
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="footer-container">

      <span class="footer-spacer"></span>

      <div>

        <button mat-button class="footer-button-first-page"
                [disabled]="!host.canClickFirstPageButton()"
                (click)="host.onClickFirstPageButton()">
          <mat-icon> skip_previous </mat-icon>
        </button>

        <button mat-button class="footer-button-previous-page"
                [disabled]="!host.canClickPreviousPageButton()"
                (click)="host.onClickPreviousPageButton()">
          <mat-icon> keyboard_arrow_left </mat-icon>
        </button>

        <span class="footer-page-number">
          Page {{ host.pageNumber }}
        </span>

        <button mat-button class="footer-button-next-page"
                [disabled]="!host.canClickNextPageButton()"
                (click)="host.onClickNextPageButton()">
          <mat-icon> keyboard_arrow_right </mat-icon>
        </button>

      </div>

    </div>
  `,
  standalone: true,
  styleUrls: ['footer.scss']
})
export class PaginatedFooter implements OnInit {

  @Input() host: any;

  private logger: LoggerService = inject(LoggerService);

  public ngOnInit() {

    this.logger.info('Paginated Footer Component: ngOnInit()');
  }

}
