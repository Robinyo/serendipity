import {
  AfterViewInit,
  Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';

import { Observable, Subscription } from 'rxjs';

import { Form } from '@bpmn-io/form-js-viewer';

import { AuthService } from 'serendipity-auth-lib';
import { ActionBar } from 'serendipity-components-lib';
import { LoggerService } from 'serendipity-utils-lib';

import { TasksService } from '../../services/tasks/tasks';

import { Tab } from './constants';

@Component({
  selector: 'task',
  imports: [
    ActionBar,
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
export class Task implements AfterViewInit, OnDestroy, OnInit, OnChanges, OnDestroy {

  @Input() task!: any;

  @Output() completeEvent: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('formWrapper', { static: true }) formWrapper!: ElementRef;
  // @ViewChild('processDiagram', {static: false})
  // image!: ElementRef;

  public selectedTabIndex = 0;

  protected authService: AuthService = inject(AuthService);
  protected logger = inject(LoggerService);
  protected tasksService: TasksService = inject(TasksService);

  protected subscriptions: Subscription[] = [];

  private formInstance!: Form;
  private schema: any;
  private data: any = {};

  private currentUser: any;

  constructor() {

    this.logger.info('Task Component: constructor()');

    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {

    // Initialize the vanilla form-js instance
    this.formInstance = new Form({
      container: this.formWrapper.nativeElement
    });

    // Listen for form submissions and emit up to parent component
    this.formInstance.on('submit', (event: any) => {
      this.completeEvent.emit(event);
    });

    // this.loadForm();
  }

  public ngAfterViewInit() {

    this.logger.info('Task Component: ngAfterViewInit()');

    this.subscribe();

  }

  public ngOnChanges(changes: SimpleChanges)  {

    this.logger.info('Task Component: ngOnChanges()');

    // If the task changes then select the first (Tasks) tab
    this.selectedTabIndex = 0;

    this.unsubscribe();
    this.subscribe();

  }

  protected subscribe(): void {

    this.logger.info('Task Component: subscribe()');

    if (this.task) {

      let subscription: Subscription = new Subscription();
      this.subscriptions.push(subscription);

      subscription = this.tasksService.form(this.task.userTaskKey).subscribe(

        (response: any) => {

          // this.logger.info('response: ' + JSON.stringify(response, null, 2))

          this.schema = JSON.parse(response.schema);

          this.logger.info('schema: ' + JSON.stringify(this.schema, null, 2))

          this.loadForm();

        });

    }

  }

  protected unsubscribe(): void {

    this.logger.info('Task Component: unsubscribe()');

    // this.formInstance = null;
    this.schema = null;
    this.data = {};

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

  }

  private async loadForm(): Promise<void> {

    this.logger.info('Task Component: loadForm()');

    if (this.schema) {

      try {
        await this.formInstance.importSchema(this.schema, this.data);
      } catch (err) {
        this.logger.error(err);
      }

    }

  }

  public ngOnDestroy() {

    this.logger.info('Task Component: ngOnDestroy()');

    this.unsubscribe();

    if (this.formInstance) {
      this.formInstance.destroy();
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

  public isValid() {

    this.logger.info('Task Component: isValid()');

    let valid = true;

    const errors = this.formInstance.validate();

    if (Object.keys(errors).length) {
      valid = false;
      this.logger.error(errors);
    }

    return valid;

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

        });

    }

  }

  public onComplete() {

    this.logger.info('Task Component: onComplete()');

  }

  public async onTabChanged($event: any) {

    this.logger.info('Task Component: onTabChanged()');

    this.selectedTabIndex = $event.index;

    this.logger.info('selectedTabIndex: ' + this.selectedTabIndex);

    switch (this.selectedTabIndex) {

      case Tab.PEOPLE:
        break;

      case Tab.HISTORY:
        break;

      default:
        break;

    }

  }

}
