import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { AuthService } from 'auth-lib';
import { LoggerService } from 'utils-lib';

import { FilterRepresentationModel } from '../../models/filter.model';

@Component({
  selector: 'flow-task-list-filter',
  template: `
    <ng-container>

      <span class="task-list-filter-title"> {{title}} </span>

      <button mat-button [matMenuTriggerFor]="menu" class="task-list-filter-menu-button">
        <mat-icon svgIcon="arrow-drop-down"> </mat-icon>
      </button>

      <mat-menu #menu="matMenu">

        <button *ngFor="let item of items" mat-menu-item (click)="onMenuClick(item)">
          <mat-icon svgIcon="{{item.icon}}" color="primary"> </mat-icon>
          <span> {{item.name}} </span>
        </button>

      </mat-menu>

    </ng-container>
  `,
  styleUrls: ['./task-list-filter.component.scss']
})
export class TaskListFilterComponent implements OnInit {

  @Output() filterClick = new EventEmitter<FilterRepresentationModel>();

  public title = 'Tasks';
  public items!: FilterRepresentationModel[];

  private currentUser;

  constructor(private authService: AuthService,
              private logger: LoggerService) {

    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {

    this.logger.info('TaskListFilterComponent: ngOnInit()');

    this.items = [
      {
        name : 'I am involved',
        filter : {
          name: 'involvedUser',
          assignment: this.currentUser.username
        },
        icon : 'assignment-ind'
      },
      {
        name : 'I am the assignee',
        filter : {
          name: 'assignee',
          assignment: this.currentUser.username
        },
        icon : 'assignment-ind'
      },
      {
        name : 'I am one of the candidates',
        filter : {
          // name: 'candidateUser',
          name: 'candidate',
          assignment: this.currentUser.username
        },
        icon : 'assignment-ind'
      }
    ];

  }

  //
  // Menu events
  //

  public onMenuClick(item: FilterRepresentationModel) {

    this.logger.info('TaskListFilterComponent: onMenuClick()');

    this.filterClick.emit(item);
  }

}
