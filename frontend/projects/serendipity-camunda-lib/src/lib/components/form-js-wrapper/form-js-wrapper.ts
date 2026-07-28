import {
  AfterViewInit,
  Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild
} from '@angular/core';
import { Form } from '@bpmn-io/form-js-viewer';

import { LoggerService } from 'serendipity-utils-lib';

import { TasksService } from '../../services/tasks/tasks';
import {Subscription} from 'rxjs';

@Component({
  selector: 'form-js-wrapper',
  standalone: true,
  template: `<div #formContainer class="form-container"></div>`,
  styleUrl: './form-js-wrapper.scss'
})
export class FormJsWrapper implements AfterViewInit, OnDestroy, OnInit, OnChanges, OnDestroy {

  @ViewChild('formContainer', { static: true }) formContainer!: ElementRef;

  @Input() task!: any;

  @Output() completeEvent: EventEmitter<any> = new EventEmitter<any>();

  protected logger = inject(LoggerService);
  protected subscriptions: Subscription[] = [];

  private tasksService: TasksService = inject(TasksService);

  private formInstance!: Form;
  private schema: any;
  private data: any = {};

  constructor() {
    this.logger.info('FormJsWrapper Component: constructor()');
  }

  ngOnInit(): void {

    // Initialize the vanilla form-js instance
    this.formInstance = new Form({
      container: this.formContainer.nativeElement
    });

    // Listen for form submissions and emit up to parent component
    this.formInstance.on('submit', (event: any) => {
      this.completeEvent.emit(event);
    });

    // this.loadForm();
  }

  public ngAfterViewInit() {

    this.logger.info('FormJsWrapper Component: ngAfterViewInit()');

    this.subscribe();

  }

  public ngOnChanges(changes: SimpleChanges)  {

    this.logger.info('FormJsWrapper Component: ngOnChanges()');

    // If the task changes then select the first (Tasks) tab
    // this.selectedTabIndex = 0;

    this.unsubscribe();
    this.subscribe();

  }

  protected subscribe(): void {

    this.logger.info('FormJsWrapper Component: subscribe()');

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

    this.logger.info('FormJsWrapper Component: unsubscribe()');

    // this.formInstance = null;
    this.schema = null;
    this.data = {};

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

  }

  private async loadForm(): Promise<void> {

    this.logger.info('FormJsWrapper Component: loadForm()');

    if (this.schema) {
      try {
        await this.formInstance.importSchema(this.schema, this.data);
      } catch (err) {
        this.logger.error(err);
      }
    }

  }

  public ngOnDestroy() {

    this.logger.info('FormJsWrapper Component: ngOnDestroy()');

    this.unsubscribe();

    if (this.formInstance) {
      this.formInstance.destroy();
    }

  }

}
