import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';

import { AuthService } from 'auth-lib';
import { DynamicFormModel, DynamicFormService } from 'dynamic-forms-lib';
import { DialogService } from 'serendipity-components-lib';
import { LoggerService } from 'utils-lib';

import { ProcessesService } from '../../services/processes/processes.service';
import { TasksService } from '../../services/tasks/tasks.service';

import { IdentityLink } from '../../models/identity-link';
import { ProcessModel } from '../../models/process-list.model';
import { TaskCompleteEvent, TaskModel } from '../../models/task-list.model';
import { Action, TaskActionRequest } from '../../models/task-action';

// import { formatISO } from 'date-fns/formatISO';

enum tab {
  TASK ,
  PEOPLE,
  SUBTASKS,
  DOCUMENTS,
  HISTORY
}

@Component({
  selector: 'flow-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnChanges, OnDestroy {

  @Input() task!: TaskModel;

  @Output() completeEvent = new EventEmitter<TaskCompleteEvent>();

  @ViewChild('processDiagram', {static: false})
  image!: ElementRef;

  public isDiagram = false;
  public process!: ProcessModel;
  public roles!: IdentityLink[] | null;
  public selectedTabIndex = 0;
  public taskFormGroup!: FormGroup | null;
  public taskModel!: DynamicFormModel;

  private currentUser: any;
  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService,
              private dialogService: DialogService,
              private dynamicFormService: DynamicFormService,
              private processesService: ProcessesService,
              private tasksService: TasksService,
              private logger: LoggerService) {}

  ngOnInit() {

    this.logger.info('TaskComponent: ngOnInit()');

    this.currentUser = this.authService.getCurrentUser();

    // this.logger.info('currentUser: ' + JSON.stringify(this.currentUser, null, 2));
  }

  public ngOnChanges(changes: SimpleChanges)  {

    this.logger.info('TaskComponent: ngOnChanges()');

    // If the task changes then select the Task tab
    this.selectedTabIndex = 0;

    this.unsubscribe();
    this.subscribe();
  }

  protected async subscribe() {

    this.logger.info('TaskComponent: subscribe()');

    if (this.task && this.task.processInstanceId) {

      let modelSubscription: Subscription = new Subscription();
      this.subscriptions.push(modelSubscription);

      modelSubscription = this.processesService.findById(this.task.processInstanceId).subscribe(data => {

        this.logger.info('ProcessModel: ' + JSON.stringify(data, null, 2));

        this.process = data;

      });

      if (this.task.formKey) {
        this.taskModel = await this.dynamicFormService.getFormMetadata(this.task.formKey);
        this.taskFormGroup = this.dynamicFormService.createGroup(this.taskModel);
      }

    }

  }

  protected unsubscribe() {

    this.logger.info('TaskComponent: unsubscribe()');

    this.isDiagram = false;
    // this.taskModel = null;
    this.taskFormGroup = null;
    this.roles = null;

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

  }

  public ngOnDestroy() {

    this.logger.info('TaskComponent: ngOnDestroy()');

    this.unsubscribe();
  }

  //
  // Validation
  //

  public canClaim() {

    // this.logger.info('TaskComponent: canClaim()');

    let claim = false;

    if (this.task && this.task.assignee === null) {
      claim = true;
    }

    return claim;

  }

  public isValid() {

    let valid = true;

    if (this.taskFormGroup) {
      valid = this.taskFormGroup.valid;
    }

    return valid;

  }

  //
  // Command events
  //

  public onClaim() {

    const taskAction: TaskActionRequest = {
      'action' : Action.claim,
      'assignee' : this.currentUser.username
    };

    this.logger.info('taskAction: ' + JSON.stringify(taskAction, null, 2));

    if (this.task && this.task.id) {
      this.tasksService.actionTask(this.task.id, taskAction).then(() => {
        this.task.assignee = this.currentUser.username;
      });
    }

  }

  public onComplete() {

    this.logger.info('TaskComponent: onComplete()');

    if (this.taskFormGroup && this.taskModel) {

      let flowableType = '';
      let value = '';

      const properties: any[] = [];

      this.taskModel.forEach(controlModel => {

        flowableType = 'string';

        // @ts-ignore
        value = this.taskFormGroup.value[controlModel.id.valueOf()];

        // https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
        // TODO: handle locales, etc.

        if (controlModel.type === 'date') {
          flowableType = 'date';
          // const date: Date = new Date(value);
          // value = format(date, 'dd-MM-yyyy');
          // value = formatISO(new Date(value));
          value = new Date(value).toISOString();
        }

        if (controlModel.inputType === 'number') {

          flowableType = 'integer';

          properties.push({
            'id': controlModel.id,
            // 'name': controlModel.label, // 'name': controlModel.name,
            'name': controlModel.id,       // See: https://github.com/flowable/flowable-engine/issues/1471
            'type': flowableType,
            'value': Number(value)
          });

        } else {

          properties.push({
            'id': controlModel.id,
            // 'name': controlModel.label, // 'name': controlModel.name,
            'name': controlModel.id,       // See: https://github.com/flowable/flowable-engine/issues/1471
            'type': flowableType,
            'value': value
          });

        }

      });

      // const body = { 'taskId' : this.task.id, 'properties' : properties };

      // this.logger.info('body: ' + JSON.stringify(body, null, 2));

      const taskAction: TaskActionRequest = {
        'action' : Action.complete,
        'assignee' : this.currentUser.username,
        'formDefinitionId' : this.task.formKey,
        'variables' : properties,
        'outcome': 'completed'
      };

      this.logger.info('taskAction: ' + JSON.stringify(taskAction, null, 2));

      if (this.task && this.task.id) {

        this.tasksService.completeTask(this.task.id, taskAction).then(() => {
          this.completeEvent.emit({ id: this.task.id });
        });

      }

    } else {

      const taskAction: TaskActionRequest = {
        'action' : Action.complete,
        'assignee' : this.currentUser.username,
        'variables' : []
      };

      if (this.task && this.task.id) {

        this.tasksService.completeSimpleTask(this.task.id, taskAction).then(() => {
          this.completeEvent.emit({ id: this.task.id });
        });

      }

    }

  }

  public async onTabChanged($event: any) {

    this.logger.info('TaskComponent: onTabChanged()');

    const clickedIndex = $event.index;

    this.logger.info('clickedIndex: ' + clickedIndex);

    switch (clickedIndex) {

      case tab.PEOPLE:

        if (this.roles === null) {

          let modelSubscription: Subscription = new Subscription();
          this.subscriptions.push(modelSubscription);

          if (this.task && this.task.id) {

            modelSubscription = this.tasksService.getRoles(this.task.id).subscribe(data => {

              this.logger.info('roles: ' + JSON.stringify(data, null, 2));

              this.roles = data;

              // @ts-ignore
              for (const role of this.roles) {
                if (role.user === null) {
                  role.user = this.currentUser.username;
                }
              }

            });

          }

        }

        break;

      case tab.HISTORY:

        if (!this.isDiagram) {

          if (this.task && this.task.processInstanceId) {

            await this.processesService.getDiagram(this.task.processInstanceId).then((response) => {

              this.image.nativeElement.src = URL.createObjectURL(response);
              this.isDiagram = true;

            }).catch(error => {

              // this.logger.info('error: ' + JSON.stringify(error, null, 2));

              this.logger.error(error);
            });

          }

        }

        break;

      default:
        break;

    }

  }

}
