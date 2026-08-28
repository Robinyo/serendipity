import { Component, inject, input, output, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'collection-footer',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="footer-container">
      <!-- All Selection Button -->
      <button [id]="footerAllLabel()" mat-button class="footer-all-button"
              (click)="filterSelected.emit(footerAllLabel())"
              [class.active]="selectedItemId() === footerAllLabel()">
        {{ footerAllLabel() }}
      </button>

      <button mat-button disabled class="footer-separator-button">|</button>

      <!-- Alphabet Filter Generation Loop -->
      @for (character of alphabet(); track character) {
        <button [id]="character" mat-button class="footer-character-button"
                (click)="filterSelected.emit(character)"
                [class.active]="selectedItemId() === character">
          {{ character }}
        </button>
      }

      <button mat-button disabled class="footer-separator-button">|</button>

      <div>
        <!-- Pagination Triggers -->
        <button mat-button class="footer-button-first-page"
                [disabled]="!canPagePrevious()"
                (click)="firstPageClicked.emit()">
          <mat-icon>skip_previous</mat-icon>
        </button>

        <button mat-button class="footer-button-previous-page"
                [disabled]="!canPagePrevious()"
                (click)="previousPageClicked.emit()">
          <mat-icon>keyboard_arrow_left</mat-icon>
        </button>

        <span class="footer-page-number">
          Page {{ pageNumber() }}
        </span>

        <button mat-button class="footer-button-next-page"
                [disabled]="!canPageNext()"
                (click)="nextPageClicked.emit()">
          <mat-icon>keyboard_arrow_right</mat-icon>
        </button>
      </div>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./footer.scss']
})
export class CollectionFooter {

  // 📥 State Signals passed cleanly down from the parent view
  public alphabet = input<string[]>(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']);
  public footerAllLabel = input<string>('All');
  public selectedItemId = input<string>('All');
  public pageNumber = input<number>(1);
  public canPagePrevious = input<boolean>(false);
  public canPageNext = input<boolean>(false);

  // 📤 Action Emitters passing events back up to the parent
  public filterSelected = output<string>();
  public firstPageClicked = output<void>();
  public previousPageClicked = output<void>();
  public nextPageClicked = output<void>();

}
