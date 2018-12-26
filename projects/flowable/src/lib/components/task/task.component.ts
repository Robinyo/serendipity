import { AfterViewInit, Component, OnDestroy, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Subscription} from 'rxjs';

import { DynamicFormModel, DynamicFormService } from 'dynamic-forms';

import { TaskModel } from '../../models/task-list.model';

import { LoggerService } from 'utils';

@Component({
  selector: 'flow-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() task: TaskModel;

  completeButton = 'COMPLETE';

  protected subscriptions: Subscription[] = [];

  public taskFormGroup: FormGroup;
  public taskModel: DynamicFormModel; // DynamicFormControlModel[] = [];

  constructor(private dynamicFormService: DynamicFormService,
              private logger: LoggerService) {}

  ngOnInit() {

    this.logger.info('TaskComponent: ngOnInit()');
    // this.logger.info('this.task.formKey: ' + this.task.formKey);

    this.subscribe();
  }

  public ngAfterViewInit() {

    this.logger.info('TaskComponent: ngAfterViewInit()');
    // this.logger.info('this.task.formKey: ' + this.task.formKey);
  }

  // leave-application-form this.task.formKey

  protected subscribe() {

    this.logger.info('TaskComponent: subscribe()');

    let formSubscription: Subscription = new Subscription();
    this.subscriptions.push(formSubscription);

    formSubscription = this.dynamicFormService.getFormMetadata('leave-application-form.json').subscribe(metaData => {

      this.taskModel = metaData;
      this.taskFormGroup = this.dynamicFormService.createGroup(this.taskModel);
    });

  }

  protected unsubscribe(): void {

    this.logger.info('TaskComponent: unsubscribe()');

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

  }

  public ngOnDestroy() {

    this.logger.info('TaskComponent: ngOnDestroy()');
    this.unsubscribe();
  }

  public onComplete() {
    this.logger.info('TaskComponent: ngOnonCompleteInit()');
  }

}
