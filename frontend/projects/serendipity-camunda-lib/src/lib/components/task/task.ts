import {
  Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';

import { concatMap, Observable, Subscription } from 'rxjs';

import { Form } from '@bpmn-io/form-js-viewer';

import { ActionBar, Composite } from 'serendipity-components-lib';

import { BpmnJsWrapper } from '../bpmn-js-wrapper/bpmn-js-wrapper';

import { TasksService } from '../../services/tasks/tasks';

import { Tab } from './constants';

@Component({
  selector: 'task',
  imports: [
    ActionBar,
    BpmnJsWrapper,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatTabsModule
  ],
  standalone: true,
  templateUrl: './task.html',
  styleUrl: './task.scss'
})
export class Task extends Composite implements OnInit, OnChanges {

  @Input() task!: any;

  @Output() completeEvent: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('formWrapper', { static: true }) formWrapper!: ElementRef;

  public selectedTabIndex = 0;

  protected tasksService: TasksService = inject(TasksService);

  private formInstance!: Form;
  private schema: any;
  private data: any = {};

  private currentUser: any;

  constructor() {

    super();

    this.logger.info('Task Component: constructor()');

    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {

    // Initialize the vanilla form-js instance
    this.formInstance = new Form({
      container: this.formWrapper.nativeElement
    });

  }

  public ngOnChanges(changes: SimpleChanges)  {

    this.logger.info('Task Component: ngOnChanges()');

    // If the task changes then select the first (Tasks) tab
    this.selectedTabIndex = 0;

    this.unsubscribe();

    // this.formInstance = null;
    this.schema = null;
    this.data = {};

    this.subscribe();

  }

  protected override subscribe(): void {

    this.logger.info('Task Component: subscribe()');

    if (this.task) {

      this.isLoading = true;

      let subscription: Subscription = new Subscription();
      this.subscriptions.push(subscription);

      subscription = this.tasksService.form(this.task.userTaskKey).subscribe(

        (response: any) => {

          // this.logger.info('response: ' + JSON.stringify(response, null, 2))

          this.schema = JSON.parse(response.schema);

          // this.logger.info('schema: ' + JSON.stringify(this.schema, null, 2))

          this.loadForm();

          this.isLoading = false;

          this.detectChanges();

        });

    }

  }

  public override ngOnDestroy() {

    this.logger.info('Task Component: ngOnDestroy()');

    super.ngOnDestroy();

    if (this.formInstance) {
      this.formInstance.destroy();
    }

  }

  private async loadForm(): Promise<void> {

    this.logger.info('Task Component: loadForm()');

    if (this.schema) {

      try {

        await this.formInstance.importSchema(this.schema, this.data);

        if (this.task && this.task.assignee === null) {
          this.formInstance.setProperty('readOnly', true);
        }

      } catch (error) {
        this.logger.error(error);
      }

    }

  }

  //
  // Validation
  //

  public canDeactivate(): Observable<boolean> | boolean {
    throw new Error("Method not implemented.");
  }
  public isDirty(): boolean {
    throw new Error("Method not implemented.");
  }
  public markAsPristine(): void {
    throw new Error("Method not implemented.");
  }

  public canClaim() {

    // this.logger.info('Task Component: canClaim()');

    let claim = false;

    if (this.task && this.task.assignee === null) {
      claim = true;
    }

    return claim;

  }

  //
  // Command events
  //

  public onClaim() {

    this.logger.info('Task Component: onClaim()');

    const taskAction = {
      assignee: this.currentUser.username,
      allowOverride: true,
      action: 'assign'
    };

    this.logger.info('taskAction: ' + JSON.stringify(taskAction, null, 2));

    if (this.task) {

      let subscription: Subscription = new Subscription();
      this.subscriptions.push(subscription);

      subscription = this.tasksService.assignment(this.task.userTaskKey, taskAction).subscribe(

        (response: any) => {

          // this.logger.info('response: ' + JSON.stringify(response, null, 2))

          this.task.assignee = taskAction.assignee;

          this.formInstance.setProperty('readOnly', false);

          this.detectChanges();

        });

    }

  }

  // If you are handling the submit action programmatically, form.submit() automatically runs validation and returns
  // both the form data and the errors object.

  public onCompleteIt() {

    this.logger.info('Task Component: onComplete()');

    const {data, errors} = this.formInstance.submit();

    if (Object.keys(errors).length === 0) {

      this.logger.info('Task Component: All required fields are complete');

      // this.logger.info('data: ' + JSON.stringify(data, null, 2))

      let subscription: Subscription = new Subscription();
      this.subscriptions.push(subscription);

      // The POST /v2/user-tasks/:userTaskKey/completion endpoint is strongly consistent, meaning it reflects the
      // real-time state of the system immediately. However, POST /v2/user-tasks/search is eventually consistent — it
      // returns data exported by the Camunda Exporter, which may lag behind the real-time state.

      subscription = this.tasksService.completion(this.task.userTaskKey, data).pipe(
        concatMap(user => {
          return this.tasksService.pollTask(this.task.userTaskKey);
        })
      ).subscribe(() => {
        this.completeEvent.emit({ userTaskKey: this.task.userTaskKey });
      });

    }

  }

  public onComplete() {

    this.logger.info('Task Component: onComplete()');

    const { data, errors } = this.formInstance.submit();

    if (Object.keys(errors).length === 0) {

      this.logger.info('Task Component: All required fields are complete');

      // this.logger.info('data: ' + JSON.stringify(data, null, 2))

      const subscription: Subscription = this.tasksService.completion(this.task.userTaskKey, data).pipe(
        concatMap((response) => {
          // Option 1: Use the return value from completion if needed
          // Option 2: Run pollTask with backoff/interval logic
          return this.tasksService.pollTask(this.task.userTaskKey);
        })
      ).subscribe({
        next: (completedTask) => {
          // Optional: you can inspect the final completed task object here
          this.logger.info('Task successfully completed & confirmed via polling', JSON.stringify(completedTask, null, 2));
        },
        complete: () => {
          // Triggers after both completion AND pollTask complete
          this.completeEvent.emit({ userTaskKey: this.task.userTaskKey });
        },
        error: (error) => {
          this.logger.error('Error during task completion or polling', error);
        }
      });

      this.subscriptions.push(subscription);
    }
  }

  public async onTabChanged($event: any) {

    this.logger.info('Task Component: onTabChanged()');

    this.selectedTabIndex = $event.index;

    this.logger.info('selectedTabIndex: ' + this.selectedTabIndex);

  }

}
