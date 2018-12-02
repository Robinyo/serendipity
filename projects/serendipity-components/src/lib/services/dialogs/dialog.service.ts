import { Injectable, ViewContainerRef, Provider, SkipSelf, Optional } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

import { AlertDialogComponent } from '../../components/dialogs/alert-dialog/alert-dialog.component';

export interface DialogConfig extends MatDialogConfig {
  title?: string;
  message: string;
}

export interface AlertDialogConfig extends DialogConfig {
  closeButton?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) {}

  public openAlert(config: AlertDialogConfig): MatDialogRef<AlertDialogComponent> {

    const dialogConfig: MatDialogConfig = this.createConfig(config);

    const dialogRef: MatDialogRef<AlertDialogComponent> = this.dialog.open(AlertDialogComponent, dialogConfig);
    const alertDialogComponent: AlertDialogComponent = dialogRef.componentInstance;
    alertDialogComponent.title = config.title;
    alertDialogComponent.message = config.message;

    if (config.closeButton) {
      alertDialogComponent.closeButton = config.closeButton;
    }

    return dialogRef;
  }

  private createConfig(config: DialogConfig): MatDialogConfig {

    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    Object.assign(dialogConfig, config);

    return dialogConfig;
  }

}
