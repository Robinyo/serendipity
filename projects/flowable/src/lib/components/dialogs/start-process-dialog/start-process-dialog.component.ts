import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';

import { DialogService, SnackBarComponent } from 'serendipity-components';
import { LoggerService } from 'utils';

import { ProcessModel } from '../../../models/process-list.model';
import { ProcessesService } from '../../../services/processes/processes.service';

@Component({
  selector: 'flow-start-process-dialog',
  templateUrl: './start-process-dialog.component.html',
  styleUrls: ['./start-process-dialog.component.scss']
})
export class StartProcessDialogComponent {

  public title: string;
  public message: string;
  public cancelButton = 'CANCEL';
  public startButton = 'START';

  private selectedItem: ProcessModel = null;
  private disabled = false;

  constructor(private dialogRef: MatDialogRef<StartProcessDialogComponent>,
              private dialogService: DialogService,
              private processesService: ProcessesService,
              private snackBar: MatSnackBar,
              private logger: LoggerService) {}

  public onSelectEvent(event: ProcessModel) {

    this.logger.info('StartProcessDialogComponent: onSelectEvent()');

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

    this.logger.info('StartProcessDialogComponent: onStart()');

    // This may take a while ...

    this.disabled = true;

    const processModel = {
      'name' : this.selectedItem.name,
      'processDefinitionId' : this.selectedItem.id,
      'startedBy' : {
        'email' : 'admin@serendipity.org.au',
        'firstName' : 'Flowable',
        'fullName' : 'Flowable Admin',
        'groups': [],
        'id' : 'flowable',
        'lastName' : 'Admin',
        'privileges': [],
        'tenantId' : null
      },
      'variables': [
        {
          'name': 'initiator',
          'type' : 'string',
          'value': 'flowable',
          'scope' : 'local'
        }
      ]
    };

    this.logger.info('processModel: ' + JSON.stringify(processModel, null, 2));

    this.processesService.startProcess(processModel).then(() => {

      this.openSnackBar();

      // this.disabled = false;

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

  private openSnackBar() {

    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: 'Process started'
      },
      duration: 500,
      panelClass: 'crm-snack-bar'
    });

  }

}
