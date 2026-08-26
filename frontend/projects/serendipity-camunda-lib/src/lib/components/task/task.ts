import {
  AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output,
  SimpleChanges, ViewChild,
  ChangeDetectionStrategy
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

// import { Tab } from './constants';

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
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './task.scss'
})
export class Task extends Composite implements AfterViewInit, OnInit, OnChanges, OnDestroy {

  @Input() task!: any;

  @Output() completeEvent: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('formWrapper', { static: true }) formWrapper!: ElementRef<HTMLDivElement>;

  public selectedTabIndex = 0;

  protected tasksService: TasksService = inject(TasksService);

  private formInstance!: Form;
  private schema: any;
  private data: any = {};

  private buttonClickListener?: (event: Event) => void;

  // private currentUser: any;

  private username: String | undefined;

  constructor() {

    super();

    this.logger.info('Task Component: constructor()');

    // this.currentUser = this.authService.getCurrentUser();
    this.username = this.authService.getUsername();
  }

  ngOnInit(): void {

    // Initialize the vanilla form-js instance
    this.formInstance = new Form({
      container: this.formWrapper.nativeElement
    });

  }

  public override ngAfterViewInit() {

    this.logger.info('FormJsWrapper Component: ngAfterViewInit()');

    super.ngAfterViewInit();

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

      const subscription: Subscription = this.tasksService.form(this.task.userTaskKey).subscribe(

        (response: any) => {

          // this.logger.info('response: ' + JSON.stringify(response, null, 2))

          this.schema = JSON.parse(response.schema);

          // this.logger.info('schema: ' + JSON.stringify(this.schema, null, 2))

          this.loadForm();

          this.isLoading = false;

          this.detectChanges();

        });

      this.subscriptions.push(subscription);

    }

  }

  public override ngOnDestroy() {

    this.logger.info('Task Component: ngOnDestroy()');

    super.ngOnDestroy();

    if (this.formWrapper && this.formWrapper.nativeElement && this.buttonClickListener) {
      const nativeContainer = this.formWrapper.nativeElement;
      nativeContainer.removeEventListener('click', this.buttonClickListener);
    }

    if (this.formInstance) {
      this.formInstance.destroy();
    }

  }

  private async loadForm(): Promise<void> {

    this.logger.info('Task Component: loadForm()');

    if (this.schema) {

      try {

        await this.formInstance.importSchema(this.schema, this.data);

        const nativeContainer = this.formWrapper.nativeElement;

        // Grab all button elements rendered inside the form container
        const allButtons = nativeContainer.querySelectorAll('button');

        if (this.task && this.task.assignee === null) {

          this.formInstance.setProperty('readOnly', true);

          // Iterate through each button and apply the disabled properties
          allButtons.forEach((btn: HTMLButtonElement) => {
            btn.setAttribute('disabled', 'true');    // Blocks native HTML click actions
            btn.style.opacity = '0.5';                                  // Visual indicator (gray out)
            btn.style.cursor = 'not-allowed';                           // Changes cursor on hover
          });

        } else {

          this.formInstance.setProperty('readOnly', false);

          allButtons.forEach((btn: HTMLButtonElement) => {
            btn.removeAttribute('disabled');     // Re-enables native HTML click actions
            btn.style.opacity = '1';                          // Restores full visibility
            btn.style.cursor = 'pointer';                     // Restores standard pointer cursor
          });

        }


        if (this.buttonClickListener) {
          nativeContainer.removeEventListener('click', this.buttonClickListener);
        }

        // Set up Event Delegation on the parent container
        this.buttonClickListener = (event: Event) => {

          // Cast target to HTMLElement so TypeScript understands it
          const target = event.target as HTMLElement;

          // Check if the clicked element (or its parent wrapper) matches the Lookup button
          if (target && target.tagName === 'BUTTON' && target.textContent?.trim() === 'Lookup') {

            // 1. Query form-js to see if the form is currently globally set to readOnly
            // form-js stores its configuration state under the internal properties context
            const isFormReadOnly = this.formInstance._getState()?.properties?.["readOnly"] === true;

            if (isFormReadOnly) {
              // Prevent both the default form reset AND the custom lookup logic
              event.preventDefault();
              event.stopPropagation();
              this.logger.info("Task Component: Form is in 'readOnly' mode");
              return;
            }

            // CRITICAL: Block form-js from running its built-in 'reset' action
            event.preventDefault();
            // Stop the event from hitting the parent containers multiple times
            event.stopPropagation();

            this.logger.info("Task Component: 'Lookup' button clicked");
          }
        };

        nativeContainer.addEventListener('click', this.buttonClickListener);

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
      // assignee: this.currentUser.username,
      assignee: this.username,
      allowOverride: true,
      action: 'assign'
    };

    this.logger.info('taskAction: ' + JSON.stringify(taskAction, null, 2));

    if (this.task) {

      const subscription: Subscription = this.tasksService.assignment(this.task.userTaskKey, taskAction).subscribe(

        () => {

          // this.logger.info('response: ' + JSON.stringify(response, null, 2))

          this.task.assignee = taskAction.assignee;

          this.formInstance.setProperty('readOnly', false);

          const nativeContainer = this.formWrapper.nativeElement;
          const allButtons = nativeContainer.querySelectorAll('button');

          allButtons.forEach((btn: HTMLButtonElement) => {
            btn.removeAttribute('disabled');     // Re-enables native HTML click actions
            btn.style.opacity = '1';                          // Restores full visibility
            btn.style.cursor = 'pointer';                     // Restores standard pointer cursor
          });

          this.detectChanges();

        });

      this.subscriptions.push(subscription);

    }

  }

  // If you are handling the submit action programmatically, form.submit() automatically runs validation and returns
  // both the form data and the errors object.

  public onComplete() {

    this.logger.info('Task Component: onComplete()');

    const { data, errors } = this.formInstance.submit();

    if (Object.keys(errors).length === 0) {

      this.logger.info('Task Component: All required fields are complete');

      // this.logger.info('data: ' + JSON.stringify(data, null, 2))

      const subscription: Subscription = this.tasksService.completion(this.task.userTaskKey, data).pipe(
        concatMap(() => {
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

/*

  private async loadForm(): Promise<void> {

    this.logger.info('Task Component: loadForm()');

    if (this.schema) {

      try {

        await this.formInstance.importSchema(this.schema, this.data);

        if (this.task && this.task.assignee === null) {
          this.formInstance.setProperty('readOnly', true);
        }

        const nativeContainer = this.formWrapper.nativeElement;

        // Query all elements matching the rendered button layout structure
        const resetButtons = nativeContainer.querySelectorAll('button[data-action="reset"]');

        // Find the 'Lookup' button
        const lookupBtn = Array.from(resetButtons).find(
          // @ts-ignore
          (btn) => btn.textContent?.trim() === 'Lookup'
        ) as HTMLElement | undefined;

        // Bind your custom Angular logic
        if (lookupBtn) {

          this.buttonClickListener = (event: Event) => {

            // CRITICAL: Prevents form-js from executing its default clear/reset pipeline
            event.preventDefault();

            this.logger.info('Task Component: Lookup button logic initiated...');

          };

          lookupBtn.addEventListener('click', this.buttonClickListener);

        } else {
          this.logger.info('Task Component: Could not locate a Lookup button in the DOM structure.');
        }

      } catch (error) {
        this.logger.error(error);
      }

    }

  }

  public override ngOnDestroy() {

    this.logger.info('Task Component: ngOnDestroy()');

    super.ngOnDestroy();

    const nativeContainer = this.formWrapper.nativeElement;

    // Query all elements matching the rendered button layout structure
    const resetButtons = nativeContainer.querySelectorAll('button[data-action="reset"]');

    // Find the 'Lookup' button
    const lookupBtn = Array.from(resetButtons).find(
      // @ts-ignore
      (btn) => btn.textContent?.trim() === 'Lookup'
    ) as HTMLElement | undefined;

    // Pass the exact same reference to remove it cleanly
    if (lookupBtn && this.buttonClickListener) {
      lookupBtn.removeEventListener('click', this.buttonClickListener);
    }

    if (this.formInstance) {
      this.formInstance.destroy();
    }

  }

*/
