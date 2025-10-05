import { Component, ElementRef, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';

import { forkJoin, Observable, Subscription } from 'rxjs';

import { ActionBar, Form } from 'serendipity-components-lib';
import { DynamicForm, DynamicFormModel, DynamicFormService } from 'serendipity-dynamic-forms-lib';

import { ProcessesService } from '../../services/processes/processes';
import { TasksService } from '../../services/tasks/tasks';

import { IdentityLink } from '../../models/identity-link';
import { ProcessModel } from '../../models/process-list';
import { TaskCompleteEvent, TaskModel } from '../../models/task-list';
import { TaskAction, TaskActionRequestModel } from '../../models/task-action';

import { Tab } from './constants';

@Component({
  selector: 'workflow-task',
  imports: [
    ActionBar,
    DynamicForm,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatTabsModule
  ],
  templateUrl: './task.html',
  standalone: true,
  styleUrl: './task.scss'
})
export class Task extends Form implements OnChanges {

  @Input() task!: TaskModel;

  @Output() completeEvent: EventEmitter<TaskCompleteEvent> = new EventEmitter<TaskCompleteEvent>();

  @ViewChild('processDiagram', {static: false})
  image!: ElementRef;

  // public isDiagram = false;
  public process!: ProcessModel;
  public roles!: IdentityLink[] | null;
  public selectedTabIndex = 0;
  public formGroup!: FormGroup;
  public formModel!: DynamicFormModel;

  private dynamicFormService: DynamicFormService = inject(DynamicFormService);
  private processesService: ProcessesService = inject(ProcessesService);
  private tasksService: TasksService = inject(TasksService);

  private currentUser: any;

  constructor() {

    super();

    this.logger.info('Task Component: constructor()');

    this.currentUser = this.authService.getCurrentUser();

  }

  public ngOnChanges(changes: SimpleChanges)  {

    this.logger.info('Task Component: ngOnChanges()');

    // If the task changes then select the first (Tasks) tab
    this.selectedTabIndex = 0;

    this.unsubscribe();

    // @ts-ignore
    this.formModel = null;

    // @ts-ignore
    this.formGroup = null;

    this.subscribe();

  }

  override subscribe(): void {

    this.logger.info('Task Component: subscribe()');

    this.isLoading = true;

    if (this.task && this.task.formKey) {

      this.logger.info('formKey: ' + this.task.formKey);

      let formModelSubscription: Subscription = new Subscription();
      this.subscriptions.push(formModelSubscription);

      formModelSubscription = this.dynamicFormService.getFormMetadata(this.task.formKey).subscribe(response => {

        this.formModel = response;

        // this.logger.info('formModel: ' + JSON.stringify(this.formModel, null, 2))

        this.formGroup = this.dynamicFormService.createGroup(this.formModel);

        // this.logger.info('formModel: ' + JSON.stringify(this.formModel, null, 2))

        this.isLoading = true;

        this.detectChanges()

      });

    }

  }

  //
  // Validation
  //

  override canDeactivate(): Observable<boolean> | boolean {
    throw new Error("Method not implemented.");
  }
  override isDirty(): boolean {
    throw new Error("Method not implemented.");
  }
  override markAsPristine(): void {
    throw new Error("Method not implemented.");
  }

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

    if (this.formGroup) {
      valid = this.formGroup.valid;
    }

    return valid;

  }

  //
  // Command events
  //

  public onClaim() {

    const taskAction: TaskActionRequestModel = {
      'action' : TaskAction.CLAIM,
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

    this.logger.info('Task Component: onComplete()');

    if (this.formGroup && this.formModel) {

      let flowableType = '';
      let value = '';

      const properties: any[] = [];

      this.formModel.forEach(controlModel => {

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

      const taskAction: TaskActionRequestModel = {
        'action' : TaskAction.COMPLETE,
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

      const taskAction: TaskActionRequestModel = {
        'action' : TaskAction.COMPLETE,
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

    this.logger.info('Task Component: onTabChanged()');

    const clickedIndex = $event.index;

    this.logger.info('clickedIndex: ' + clickedIndex);

    switch (clickedIndex) {

      case Tab.PEOPLE:

        this.logger.info('Task Component: Tab.PEOPLE');

        if (this.roles === null) {

          let subscription: Subscription = new Subscription();
          this.subscriptions.push(subscription);

          if (this.task && this.task.id) {

            subscription = this.tasksService.getRoles(this.task.id).subscribe(data => {

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

      case Tab.HISTORY:

        this.logger.info('Task Component: Tab.HISTORY');

        if (this.task && this.task.processInstanceId) {

          await this.processesService.getDiagram(this.task.processInstanceId).then((response) => {

            this.image.nativeElement.src = URL.createObjectURL(response);
            // this.isDiagram = true;

          }).catch(error => {

            // this.logger.info('error: ' + JSON.stringify(error, null, 2));

            this.logger.error(error);

          });

        }

        break;

      default:
        break;

    }

  }

}

/*

  override subscribe(): void {

    this.logger.info('Task Component: subscribe()');

    this.isLoading = true;

    if (this.task && this.task.processInstanceId && this.task.formKey) {

      // @ts-ignore
      const processModel = this.processesService.findById(this.task.processInstanceId);

      // @ts-ignore
      const formModel = this.dynamicFormService.getFormMetadata(this.task.formKey);

      forkJoin({
        processModel: processModel,
        formModel: formModel
      }).subscribe((response: any) => {

        this.process = response.processModel;
        this.formModel = response.formModel;

        // @ts-ignore
        this.formGroup = this.dynamicFormService.createGroup(this.formModel);

        // this.logger.info('process: ' + JSON.stringify(this.process, null, 2))
        // this.logger.info('formModel: ' + JSON.stringify(this.formModel, null, 2))

        this.isLoading = false;

        this.detectChanges();

      });

    }

  }

*/
