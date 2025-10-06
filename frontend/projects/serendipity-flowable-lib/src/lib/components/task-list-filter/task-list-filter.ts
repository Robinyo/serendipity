import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { AuthService } from 'serendipity-auth-lib';
import { LoggerService } from 'serendipity-utils-lib';

import { FilterRepresentationModel } from '../../models/filter';

@Component({
  selector: 'workflow-task-list-filter',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <ng-container>

      <span class="md-font-headline-lg" aria-label="Activity Bar Title">
        {{title}}
      </span>

      <button mat-button [matMenuTriggerFor]="menu" class="task-list-filter-menu-button">
        <mat-icon class="material-icons"> arrow_drop_down </mat-icon>
      </button>

      <mat-menu #menu="matMenu">

        @for (item of items; track $index) {

          <button mat-menu-item (click)="onMenuClick(item)">
            <mat-icon class="material-symbols-outlined"> {{item.icon}} </mat-icon>
            <span> {{item.name}} </span>
          </button>

        }

      </mat-menu>

    </ng-container>
  `,
  standalone: true,
  styleUrl: './task-list-filter.scss'
})
export class TaskListFilter  implements OnInit {

  @Output() filterClick = new EventEmitter<FilterRepresentationModel>();

  public title = 'Tasks';
  public items!: FilterRepresentationModel[];

  protected logger = inject(LoggerService);
  protected authService: AuthService = inject(AuthService);

  private currentUser;

  constructor() {

    this.currentUser = this.authService.getCurrentUser();

  }

  ngOnInit(): void {

    this.logger.info('Task List Filter Component: ngOnInit()');

    this.items = [
      {
        name : 'I am involved',
        filter : {
          name: 'involvedUser',
          assignment: this.currentUser.username
        },
        icon : 'assignment_ind'
      },
      {
        name : 'I am the assignee',
        filter : {
          name: 'assignee',
          assignment: this.currentUser.username
        },
        icon : 'assignment_ind'
      },
      {
        name : 'I am one of the candidates',
        filter : {
          // name: 'candidateUser',
          name: 'candidate',
          assignment: this.currentUser.username
        },
        icon : 'assignment_ind'
      }
    ];

  }

  //
  // Menu events
  //

  public onMenuClick(item: FilterRepresentationModel) {

    this.logger.info('Task List Filter Component: onMenuClick()');

    this.filterClick.emit(item);
  }

}
