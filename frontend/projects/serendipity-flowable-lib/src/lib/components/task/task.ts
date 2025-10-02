import { Component, ElementRef, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

import { forkJoin, Observable } from 'rxjs';

import { ActionBar, Form } from 'serendipity-components-lib';
import { DynamicForm, DynamicFormControlCustomEvent, DynamicFormModel, DynamicFormService } from 'serendipity-dynamic-forms-lib';

import { ProcessesService } from '../../services/processes/processes';
import { TasksService } from '../../services/tasks/tasks';

import { IdentityLink } from '../../models/identity-link';
import { ProcessModel } from '../../models/process-list';
import { TaskCompleteEvent, TaskModel } from '../../models/task-list';
import { Action, TaskActionRequest } from '../../models/task-action';

import { TABS } from './constants';

@Component({
  selector: 'workflow-task',
  imports: [
    ActionBar,
    DynamicForm,
    MatButtonModule,
    MatIconModule,
    MatTabsModule
  ],
  templateUrl: './task.html',
  standalone: true,
  styleUrl: './task.scss'
})
export class Task extends Form implements OnChanges {

  @Input() task!: TaskModel;

  @Output() completeEvent: EventEmitter<TaskCompleteEvent> = new EventEmitter<TaskCompleteEvent>();

  // @ViewChild('processDiagram', {static: false})
  // image!: ElementRef;

  public isDiagram = false;
  public process!: ProcessModel;
  public roles!: IdentityLink[] | null;
  public selectedTabIndex = 0;
  public formGroup!: FormGroup | null;
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

    // If the task changes then select the Task tab
    this.selectedTabIndex = 0;

    this.unsubscribe();
    this.subscribe();

  }

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

        this.formGroup = this.dynamicFormService.createGroup(this.formModel);

        // this.logger.info('process: ' + JSON.stringify(this.process, null, 2))
        // this.logger.info('formModel: ' + JSON.stringify(this.formModel, null, 2))

        this.isLoading = false;

        this.detectChanges();

      });

    }

  }

  override canDeactivate(): Observable<boolean> | boolean {
    throw new Error("Method not implemented.");
  }
  override isDirty(): boolean {
    throw new Error("Method not implemented.");
  }
  override isValid(): boolean {
    throw new Error("Method not implemented.");
  }
  override markAsPristine(): void {
    throw new Error("Method not implemented.");
  }

  //
  // Command events
  //

  public onClaim() {

    this.logger.info('Task Component: onClaim()');

  }

  public onComplete() {

    this.logger.info('Task Component: onComplete()');

  }

  public onTabChanged($event: any) {

    this.logger.info('Task Component: onTabChanged()');

  }

}
