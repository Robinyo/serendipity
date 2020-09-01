import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { AuthService } from 'auth';
import { LoggerService } from 'utils';

import { FilterRepresentationModel } from '../../models/filter.model';

@Component({
  selector: 'flow-task-list-filter',
  templateUrl: './task-list-filter.component.html',
  styleUrls: ['./task-list-filter.component.scss']
})
export class TaskListFilterComponent implements OnInit {

  @Output() filterClick = new EventEmitter<FilterRepresentationModel>();

  public title = 'Tasks';
  public items: FilterRepresentationModel[];

  private currentUser;

  constructor(private authService: AuthService,
              private logger: LoggerService) {

    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {

    this.logger.info('TaskListFilterComponent: ngOnInit()');

    this.items = [
      {
        name : 'Where I am involved',
        filter : {
          name: 'involvedUser',
          assignment: this.currentUser.username
        },
        icon : 'assignment_ind'
      },
      {
        name : 'Where I am the assignee',
        filter : {
          name: 'assignee',
          assignment: this.currentUser.username
        },
        icon : 'assignment_ind'
      },
      {
        name : 'Where I am one of the candidates',
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

    this.logger.info('TaskListFilterComponent: onMenuClick()');

    this.filterClick.emit(item);
  }

}
