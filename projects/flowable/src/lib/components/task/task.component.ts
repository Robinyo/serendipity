import { Component, EventEmitter, OnChanges, OnDestroy, OnInit, Input, SimpleChanges, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AuthService } from 'auth';
import { DynamicFormModel, DynamicFormService } from 'dynamic-forms';
import { DialogService } from 'serendipity-components';
import { LoggerService } from 'utils';

import { TaskCompleteEvent, TaskModel } from '../../models/task-list.model';
import { Action, TaskActionRequest } from '../../models/task-action';

// import { FormsService } from '../../services/forms/forms.service';
import { TasksService } from '../../services/tasks/tasks.service';

// import { formatISO } from 'date-fns/formatISO';

@Component({
  selector: 'flow-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnChanges, OnDestroy {

  @Input() task: TaskModel;

  @Output() completeEvent = new EventEmitter<TaskCompleteEvent>();

  public taskFormGroup: FormGroup;
  public taskModel: DynamicFormModel;

  public currentUser: any;

  constructor(private authService: AuthService,
              private dialogService: DialogService,
              private dynamicFormService: DynamicFormService,
              // private formsService: FormsService,
              private tasksService: TasksService,
              private logger: LoggerService) {}

  ngOnInit() {

    this.logger.info('TaskComponent: ngOnInit()');

    this.currentUser = this.authService.getCurrentUser();

    this.logger.info('currentUser: ' + JSON.stringify(this.currentUser, null, 2));
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

  public onClaim() {

  }

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

      this.tasksService.completeTask(this.task.id, taskAction).then(() => {

        this.completeEvent.emit({ id: this.task.id });

      }).catch(error => {

        // let message = error.message;
        let message = error;

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
        'assignee' : this.currentUser.username,
        'variables' : []
      };

      this.tasksService.completeSimpleTask(this.task.id, taskAction).then(() => {

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

  public async onTabChanged($event) {

    this.logger.info('TaskComponent: onTabChanged()');

    // const clickedIndex = $event.index;

    // this.logger.info('clickedIndex: ' + clickedIndex);
  }

}

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

      this.logger.info('body: ' + JSON.stringify(body, null, 2));

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

      this.logger.info('body: ' + JSON.stringify(body, null, 2));

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

      this.logger.info('body: ' + JSON.stringify(body, null, 2));

*/

/*

    // const filename = `leave-application-form${this.suffix}`;

    const chng = changes['task'];

    this.logger.info(JSON.stringify(chng.currentValue));
    this.logger.info(JSON.stringify(chng.previousValue));

*/
