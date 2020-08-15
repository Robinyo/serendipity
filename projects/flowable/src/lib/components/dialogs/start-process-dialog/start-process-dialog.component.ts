import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { LoggerService } from 'utils';

import { ProcessListModel, ProcessModel } from '../../../models/process-list.model';
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

  constructor(private dialogRef: MatDialogRef<StartProcessDialogComponent>,
              private logger: LoggerService) {}

  public onStart(): void {

    this.logger.info('ProcessModel: ' + JSON.stringify(this.selectedItem, null, 2));

    this.dialogRef.close(true);
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  public onSelectEvent(event: ProcessModel) {

    this.logger.info('StartProcessDialogComponent: onSelectEvent()');

    this.selectedItem = event;
  }

}
