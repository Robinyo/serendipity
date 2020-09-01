import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';

import { Subscription } from 'rxjs';

import { AuthService } from 'auth';
import { DialogService} from 'serendipity-components';

import { CollectionComponent } from '../abstract/collection/collection.component';
import { FilterRepresentationModel } from '../../models/filter.model';
import { TaskCompleteEvent, TaskListModel, TaskModel } from '../../models/task-list.model';
import { TasksService } from '../../services/tasks/tasks.service';

@Component({
  selector: 'flow-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent extends CollectionComponent<TaskModel> {

  private currentUser;
  private tasksFilter: FilterRepresentationModel;

  constructor(private authService: AuthService,
              private dialogService: DialogService,
              private tasksService: TasksService) {
    super();

    this.currentUser = this.authService.getCurrentUser();

    this.tasksFilter = {
      name : 'I am involved',
      filter : {
        name: 'involvedUser',
        assignment: this.currentUser.username
      },
      icon : 'assignment_ind'
    };

  }

  public onCompleteEvent(event: TaskCompleteEvent) {

    this.logger.info('TaskListComponent: onCompleteEvent()');

    this.logger.info('taskId: ' +  event.id);

    this.selectedItem = null;
    this.refresh();
  }

  public onFilterClickEvent(event: FilterRepresentationModel) {

    this.logger.info('TaskListComponent: onFilterClickEvent()');

    this.logger.info('filter: ' +  JSON.stringify(event, null, 2));

    this.tasksFilter = event;
    this.refresh();
  }

  protected subscribe() {

    this.logger.info('TaskListComponent: subscribe()');

    let modelSubscription: Subscription = new Subscription();
    this.subscriptions.push(modelSubscription);

    modelSubscription = this.tasksService.find(this.getParams()).subscribe(

      (model: TaskListModel) => {

        this.logger.info('TaskListComponent: subscribe() success handler');

        this.items = model.data;

        if (this.items && this.items.length) {
          this.selectedItem = this.items[0];
        }

      });

  }

  private getParams() {

    this.logger.info('TaskListComponent: getParams()');

    // this.logger.info('filter: ' +  JSON.stringify(this.filter, null, 2));

    const excludeSubTasks = 'true';
    const order = 'desc';            // 'asc | desc
    // const size = 16;
    // const start = 0;              // page
    const sort = 'createTime';

    const params = new HttpParams()
      .set(this.tasksFilter.filter.name, this.tasksFilter.filter.assignment)
      .set('excludeSubTasks', excludeSubTasks)
      .set('order', order)
      .set('sort', sort);

    // this.logger.info('params: ' +  JSON.stringify(params, null, 2));

    return params;
  }

}

/*

@Component({
  selector: 'flow-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent extends CollectionComponent<TaskModel> {

  public items: TaskModel[];
  public selectedItem: TaskModel = null;

  private subscriptions: Subscription[] = [];

  private componentDestroyed: Subject<boolean> = new Subject<boolean>();

  constructor(private dialogService: DialogService,
              private tasksService: TasksService,
              private logger: LoggerService) {}

  public ngOnInit() {

    this.logger.info('TaskListComponent: ngOnInit()');

    this.subscribe();
    // this.pollingSubscribe();
  }

  public refresh() {

    this.logger.info('TaskListComponent: refresh()');

    this.unsubscribe();
    this.subscribe();
  }

  public onCompleteEvent(event: TaskCompleteEvent) {

    this.logger.info('TaskListComponent: onCompleteEvent()');

    this.logger.info('TaskListComponent - taskId: ' +  event.id);

    this.selectedItem = null;
    this.refresh();
  }

  protected subscribe() {

    this.logger.info('TaskListComponent: subscribe()');

    let modelSubscription: Subscription = new Subscription();
    this.subscriptions.push(modelSubscription);

    modelSubscription = this.tasksService.getTasks().subscribe(

      (model: TaskListModel) => {

        this.logger.info('TaskListComponent: subscribe() success handler');

        this.items = model.data;

        if (this.items && this.items.length) {
          this.selectedItem = this.items[0];
        }

      },
      (error) => {

        this.logger.error('TaskListComponent: subscribe() error handler');

        this.items = [];
        this.selectedItem = null;

        let message = error.message;

        if (error.details) {
          message = error.details.message;
        }

        this.dialogService.openAlert({
          title: 'Alert',
          message: message,
          closeButton: 'CLOSE'
        });

     },
      () =>  {

        this.logger.info('TaskListComponent: subscribe() completion handler');
      }

    );

  }

  protected pollingSubscribe() {

    this.logger.info('TaskListComponent: subscribe()');

    let modelSubscription: Subscription = new Subscription();
    this.subscriptions.push(modelSubscription);

    modelSubscription = timer(0, 5000).pipe(
      takeUntil(this.componentDestroyed),
      switchMap(() => this.tasksService.getTasks())).subscribe((model: TaskListModel) => {

      this.items = model.data;

      if (this.selectedItem) {

        for (const item of this.items) {
          if (item.id === this.selectedItem.id) {
            this.selectedItem = item;
            break;
          }
        }

      } else {

        this.selectedItem = this.items[0];

      }

    });

  }

  protected unsubscribe(): void {

    this.logger.info('TaskListComponent: unsubscribe()');

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

  }

  public onSelect(task: TaskModel) {

    this.logger.info('TaskListComponent: onSelect()');

    this.selectedItem = task;
  }

  public ngOnDestroy() {

    this.logger.info('TaskListComponent: ngOnDestroy()');

    if (this.componentDestroyed) {
      this.componentDestroyed.next(true);
      this.componentDestroyed.unsubscribe();
    }

    this.unsubscribe();
  }

}

*/

/*

    // const taskListModel: TaskListModel = { ...model };

    if (! this.selectedItem) {
      this.selectedItem = this.items[0];
    }

protected pollingSubscribe() {

  this.logger.info('TaskListComponent: subscribe()');

  timer(0, 5000).pipe(
    switchMap(() => this.tasksService.getTasks())).subscribe(model => {
    this.items = model.data;
    this.selectedItem = this.items[0];
  });

}

*/

/*

    document.addEventListener(
      'visibilitychange', () => {
        if (document.hidden) {
          this.logger.info('visibilitychange: Document is hidden');
        } else {
          this.logger.info('visibilitychange: Document is visible');
        }
      }
    );

*/

/*

import { OnPageVisible, OnPageHidden } from 'angular-page-visibility';

  @OnPageVisible()
  public logWhenPageVisible(): void {

    this.logger.info('TaskListComponent: OnPageVisible()');
  }

  @OnPageHidden()
  public logWhenPageHidden(): void {

    this.logger.info('TaskListComponent: OnPageHidden()');
  }

  // tasks$: Observable<TaskListModel>;
  // polledTasks$: Observable<TaskListModel>;

timer(0, 5000).pipe(

  startWith(0),
  switchMap(() => this.tasksService.getTasks())
).subscribe(model => {

  this.items = model.data;
  this.selectedItem = this.items[0];
});


this.tasks$ = this.tasksService.getTasks();

this.polledTasks$ = timer(0, 1000).pipe(
  concatMap(_ => this.tasks$)
);

this.polledTasks$ = timer(0, 1000).pipe(
  concatMap(_ => this.tasks$),
  map(model => {
    this.items = model.data;
    this.selectedItem = this.items[0];
  }),
);

let modelSubscription: Subscription = new Subscription();
this.subscriptions.push(modelSubscription);

modelSubscription = this.tasksService.getTasks().subscribe(model => {

  this.items = model.data;
  this.selectedItem = this.items[0];
});

*/

/*

  protected subscribe() {

    this.logger.info('TaskListComponent: subscribe()');

    let modelSubscription: Subscription = new Subscription();
    this.subscriptions.push(modelSubscription);

    modelSubscription = this.tasksService.getTasks().subscribe(model => {

      this.items = model.data;
      this.selectedItem = this.items[0];
    });

  }

*/
