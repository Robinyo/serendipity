import { Component, OnInit, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from 'serendipity-auth-lib';
import { DialogService, SnackBar } from 'serendipity-components-lib';
import { LoggerService } from 'serendipity-utils-lib';

import { ProcessList } from '../../components/process-list/process-list';
import { ProcessModel, StartProcessModel } from '../../models/process-list';
import { ProcessesService } from '../../services/processes/processes';

@Component({
  selector: 'workflow-start-process-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    ProcessList
  ],
  template: `

    <h2 mat-dialog-title>Start a process</h2>

    <mat-dialog-content class="mat-typography">

      <workflow-process-list (selectEvent)="onSelectEvent($event)"> </workflow-process-list>

    </mat-dialog-content>

    <mat-dialog-actions align="end">

      <button #cancelBtn matButton="filled"
              aria-label="Cancel button"
              class="md-button"
              (keydown.arrowright)="startBtn.focus()"
              (click)="onCancel()">
        {{ cancelButton }}
      </button>

      <button #startBtn matButton="filled"
              aria-label="Start button"
              class="md-button"
              [disabled]="isDisabled()"
              (keydown.arrowleft)="cancelBtn.focus()"
              (click)="onStart()">
        {{ startButton }}
      </button>

    </mat-dialog-actions>

  `,
})
export class StartProcessDialog implements OnInit {

  public message!: string;
  public title!: string;
  public cancelButton = 'CANCEL';
  public startButton = 'START';

  private currentUser: any;
  private disabled = false;
  private selectedItem!: ProcessModel;

  private authService: AuthService = inject(AuthService);
  private dialogRef: MatDialogRef<StartProcessDialog> = inject(MatDialogRef);
  private dialogService: DialogService = inject(DialogService);
  private logger: LoggerService = inject(LoggerService);
  private processesService: ProcessesService = inject(ProcessesService);
  private snackBar: MatSnackBar = inject(MatSnackBar);

  constructor() {}

  public ngOnInit() {

    this.logger.info('Start Process Dialog Component: ngOnInit()');

    this.currentUser = this.authService.getCurrentUser();

    // this.logger.info('currentUser: ' + JSON.stringify(this.currentUser, null, 2));

  }

  public onSelectEvent(event: ProcessModel) {

    this.logger.info('Start Process Dialog Component: onSelectEvent()');

    this.selectedItem = event;

    this.logger.info('selectedItem: ' + JSON.stringify(this.selectedItem, null, 2));

  }

  //
  // Action bar events
  //

  public onCancel(): void {

    this.dialogRef.close(false);
  }

  public onStart(): void {

    this.logger.info('Start Process Dialog Component: onStart()');

    this.disabled = true;

    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    // @ts-ignore
    const today = new Date().toLocaleString('en-GB', options);

    this.logger.info('today: ' + today);

    const startProcessModel: StartProcessModel = {
      name : this.selectedItem.name + ' - ' + today,
      processDefinitionId : this.selectedItem.id,
      variables : [
        {
          name: 'initiator',
          type : 'string',
          value: this.currentUser.username,
          scope : 'local'
        }
      ]
    };

    this.logger.info('startProcessModel: ' + JSON.stringify(startProcessModel, null, 2));

    this.processesService.startProcess(startProcessModel).then((response) => {

      this.openSnackBar(startProcessModel.name + ' process started');

      this.logger.info('response: ' + JSON.stringify(response, null, 2));

      this.dialogRef.close(true);

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

      this.disabled = false;

    });

  }

  //
  // Validation
  //

  public isDisabled(): boolean {
    return this.disabled;
  }

  //
  // Misc
  //

  private openSnackBar(message: string) {

    this.snackBar.openFromComponent(SnackBar, {
      data: {
        message: message
      },
      duration: 500,
      panelClass: 'snack-bar'
    });

  }

}

/*

    // Request body (start by process definition id)
    // Only one of processDefinitionId, processDefinitionKey or message can be used in the request body.
    // See: https://www.flowable.com/open-source/docs/bpmn/ch14-REST/#start-a-process-instance

    const startProcessModel: StartProcessModel = {
      processDefinitionId :  this.selectedItem.id,
      businessKey : this.selectedItem.name,
      returnVariables : true,
      name : this.selectedItem.name + ' - ' + today,
      variables : [
        {
          name: 'initiator',
          value: this.currentUser.username
        }
      ]
    };


*/
