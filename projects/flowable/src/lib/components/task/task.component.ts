import { Component, EventEmitter, OnChanges, OnDestroy, OnInit, Input, SimpleChanges, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { TaskCompleteEvent, TaskModel } from '../../models/task-list';
import { Action, TaskActionRequest } from '../../models/task-action';

// import { FormsService } from '../../services/forms/forms.service';
import { TasksService } from '../../services/tasks/tasks.service';

import { DynamicFormModel, DynamicFormService } from 'dynamic-forms';

import { DialogService } from 'serendipity-components';

import { LoggerService } from 'utils';

// import { formatISO } from 'date-fns/formatISO';

@Component({
  selector: 'flow-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnChanges, OnDestroy {

  @Input() task: TaskModel;

  @Output() completeEvent = new EventEmitter<TaskCompleteEvent>();

  public completeButton = 'COMPLETE';

  public taskFormGroup: FormGroup;
  public taskModel: DynamicFormModel;

  constructor(private dialogService: DialogService,
              private dynamicFormService: DynamicFormService,
              // private formsService: FormsService,
              private tasksService: TasksService,
              private logger: LoggerService) {}

  ngOnInit() {

    this.logger.info('TaskComponent: ngOnInit()');
  }

  public ngOnChanges(changes: SimpleChanges)  {

    this.logger.info('TaskComponent: ngOnChanges()');

    // TODO
    this.taskModel = null;
    this.taskFormGroup = null;

    if (this.task && this.task.formKey) {
      this.createForm();
    }

  }

  async createForm() {

    this.logger.info('TaskComponent: createForm()');

    this.logger.info('TaskComponent createForm() formId: ' + this.task.formKey);

    this.taskModel = await this.dynamicFormService.getFormMetadata(this.task.formKey);
    this.taskFormGroup = this.dynamicFormService.createGroup(this.taskModel);
  }

  public ngOnDestroy() {
    this.logger.info('TaskComponent: ngOnDestroy()');
  }

  //
  // Misc
  //

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

  public onComplete() {

    this.logger.info('TaskComponent: onComplete()');

    if (this.taskFormGroup) {

      let flowableType = '';
      let value = '';

      const properties: any[] = [];

      this.taskModel.forEach(controlModel => {

        flowableType = 'string';

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
            'name': controlModel.label, // 'name': controlModel.name,
            'type': flowableType,
            'value': Number(value)
          });

        } else {

          properties.push({
            'id': controlModel.id,
            'name': controlModel.label, // 'name': controlModel.name,
            'type': flowableType,
            'value': value
          });

        }

      });

      // const body = { 'taskId' : this.task.id, 'properties' : properties };

      // this.logger.info('body: ' + JSON.stringify(body));

      const taskAction: TaskActionRequest = {
        'action' : Action.complete,
        'assignee' : 'rob.ferguson',
        'variables' : properties
      };

      this.logger.info('taskAction: ' + JSON.stringify(taskAction));

      this.tasksService.completeTask(this.task.id, taskAction).then(() => {

        this.completeEvent.emit({ id: this.task.id });

      }).catch(error => {

        let message = error.message;

        if (error.details) {
          message = error.details.message;
        }

        this.dialogService.openAlert({
          title: 'Alert',
          message: message,
          closeButton: 'CLOSE'
        });

      });

    } else {

      const taskAction: TaskActionRequest = {
        'action' : Action.complete,
        'variables' : []
      };

      this.tasksService.completeTask(this.task.id, taskAction).then(() => {

        this.completeEvent.emit({ id: this.task.id });

      }).catch(error => {

        let message = error.message;

        if (error.details) {
          message = error.details.message;
        }

        this.dialogService.openAlert({
          title: 'Alert',
          message: message,
          closeButton: 'CLOSE'
        });

      });

    }

  }

}

/*

      const taskAction: TaskAction = {
        'action' : 'complete',
        'assignee' : 'rob.ferguson',
        'formDefinitionId' : this.task.formKey,
        'variables' : properties,
        'outcome' : 'completed'
      };

*/

/*

  public onComplete() {

    this.logger.info('TaskComponent: onComplete()');

    if (this.taskFormGroup) {

      const properties: any[] = [];

      let type = 'string';
      let value = '';

      this.taskModel.forEach(controlModel => {

        // 'string | date'
        type = controlModel.type === 'input' ? 'string' : controlModel.type;

        value = this.taskFormGroup.value[controlModel.id.valueOf()];

        // https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
        // TODO: handle locales, etc.

       if (type === 'date') {
          const date: Date = new Date(value);
          value = format(date, 'dd-MM-yyyy');
        }

        properties.push({
          'id': controlModel.id,
          'name': controlModel.name,
          'type': type,
          'value': value
        });

      });

      const body = { 'taskId' : this.task.id, 'properties' : properties };

      this.logger.info('body: ' + JSON.stringify(body));

      this.formsService.submitFormData(body).then(() => {

        this.completeEvent.emit({ id: this.task.id });

      }).catch(error => {

        let message = error.message;

        if (error.details) {
          message = error.details.message;
        }

        this.dialogService.openAlert({
          title: 'Alert',
          message: message,
          closeButton: 'CLOSE'
        });

      });

    } else {

      const taskAction: TaskAction = {
        'action' : 'complete',
        'variables' : []
      };

      this.tasksService.completeTask(this.task.id, taskAction).then(() => {

        this.completeEvent.emit({ id: this.task.id });

      }).catch(error => {

        let message = error.message;

        if (error.details) {
          message = error.details.message;
        }

        this.dialogService.openAlert({
          title: 'Alert',
          message: message,
          closeButton: 'CLOSE'
        });

      });

    }

  }

*/

/*

import { Subscription} from 'rxjs';

  public onComplete() {

    this.logger.info('TaskComponent: onComplete()');

    let subscription: Subscription;

    if (this.taskFormGroup) {

      const properties: any[] = [];

      let type = 'string';
      let value = '';

      this.taskModel.forEach(controlModel => {

        // 'string | date'
        type = controlModel.type === 'input' ? 'string' : controlModel.type;

        value = this.taskFormGroup.value[controlModel.id.valueOf()];

        // TODO: handle locales, etc.
        if (type === 'date') {
          const date: Date = new Date(value);
          value = format(date, 'DD-MM-YYYY');
        }

        properties.push({
          'id': controlModel.id,
          'name': controlModel.name,
          'type': type,
          'value': value
        });

      });

      const body = { 'taskId' : this.task.id, 'properties' : properties };

      this.logger.info('body: ' + JSON.stringify(body));

      subscription = this.formsService.submitFormData(body).subscribe(() => {
        this.completeEvent.emit({ id: this.task.id });
        subscription.unsubscribe();
      });

    } else {

      subscription = this.tasksService.completeTask(this.task.id).subscribe(() => {
        this.completeEvent.emit({ id: this.task.id });
        subscription.unsubscribe();
      });

    }

  }

*/

/*
protected subscribe() {

  this.logger.info('TaskComponent: subscribe()');

  this.logger.info('TaskComponent - formId: ' + this.task.formKey);

  let formSubscription: Subscription = new Subscription();
  this.subscriptions.push(formSubscription);

  formSubscription = this.dynamicFormService.getFormMetadata(this.task.formKey).subscribe(metaData => {

    this.taskModel = metaData;
    this.taskFormGroup = this.dynamicFormService.createGroup(this.taskModel);
  });

}
*/


/*

      const properties: any[] = [];

      this.taskModel.forEach(controlModel => {

        properties.push({
          "id": controlModel.id,
          "name": controlModel.name,
          // "type": controlModel.type -> 'input' as per the Serendipity Form engine
          "type":  'string',  // 'string | integer | long | date '
          "value": this.taskFormGroup.value[controlModel.id.valueOf()]
        });

      });

      const body = { "taskId" : this.task.id, "properties" : properties };

      this.logger.info('body: ' + JSON.stringify(body));

*/

/*

    // const filename = `leave-application-form${this.suffix}`;

    const chng = changes['task'];

    this.logger.info(JSON.stringify(chng.currentValue));
    this.logger.info(JSON.stringify(chng.previousValue));

*/
