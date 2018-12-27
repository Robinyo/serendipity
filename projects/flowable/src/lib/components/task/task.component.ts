import { Component, OnChanges, OnDestroy, OnInit, Input, SimpleChanges } from '@angular/core';
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
export class TaskComponent implements OnInit, OnChanges, OnDestroy {

  @Input() task: TaskModel;

  completeButton = 'COMPLETE';

  protected subscriptions: Subscription[] = [];

  private suffix = '.json';

  public taskFormGroup: FormGroup;
  public taskModel: DynamicFormModel; // DynamicFormControlModel[] = [];

  constructor(private dynamicFormService: DynamicFormService,
              private logger: LoggerService) {}

  ngOnInit() {
    this.logger.info('TaskComponent: ngOnInit()');
  }

  public ngOnChanges(changes: SimpleChanges)  {

    this.logger.info('TaskComponent: ngOnChanges()');

    this.unsubscribe();

    // TODO
    this.taskModel = null;
    this.taskFormGroup = null;

    if (this.task && this.task.formKey) {
      this.subscribe();
    }

  }

  protected subscribe() {

    this.logger.info('TaskComponent: subscribe()');

    const filename = this.task.formKey + this.suffix;

    this.logger.info('TaskComponent - filename: ' + filename);

    let formSubscription: Subscription = new Subscription();
    this.subscriptions.push(formSubscription);

    formSubscription = this.dynamicFormService.getFormMetadata(filename).subscribe(metaData => {

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
    this.logger.info('TaskComponent: onComplete()');
  }

}

/*

    // const filename = `leave-application-form${this.suffix}`;

    const chng = changes['task'];

    this.logger.info(JSON.stringify(chng.currentValue));
    this.logger.info(JSON.stringify(chng.previousValue));

*/
