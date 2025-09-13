import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

import { AlertDialog } from '../../components/dialogs/alert-dialog/alert-dialog';
import { ConfirmDialog } from '../../components/dialogs/confirm-dialog/confirm-dialog';

export interface DialogConfig extends MatDialogConfig {
  message: string;
  title?: string;
}

export interface AlertDialogConfig extends DialogConfig {
  closeButton?: string;
}

export interface ConfirmDialogConfig extends DialogConfig {
  acceptButton?: string;
  cancelButton?: string;
}

// https://angular.io/guide/providers#providedin-and-ngmodules

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) {}

  /**
   * params:
   * - component: ComponentType<T>
   * - config: MatDialogConfig
   * Wrapper function for the open() method in MatDialog.
   * Opens a modal dialog containing the given component.
   */
  public open<T>(component: ComponentType<T>, config?: MatDialogConfig): MatDialogRef<T> {
    return this.dialog.open(component, config);
  }

  /**
   * Wrapper function for the closeAll() method in MatDialog.
   * Closes all open dialogs.
   */
  public closeAll(): void {
    this.dialog.closeAll();
  }

  /**
   * params:
   * - config: AlertDialogConfig {
   *     message: string;
   *     title?: string;
   *     viewContainerRef?: ViewContainerRef;
   *     closeButton?: string;
   * }
   *
   * Opens an alert dialog with the provided config.
   * Returns an MatDialogRef<AlertDialogComponent> object.
   */
  public openAlert(config: AlertDialogConfig): MatDialogRef<AlertDialog> {

    const dialogConfig: MatDialogConfig = this.createConfig(config);

    const dialogRef: MatDialogRef<AlertDialog> = this.dialog.open(AlertDialog, dialogConfig);
    const alertDialogComponent: AlertDialog = dialogRef.componentInstance;
    alertDialogComponent.title = config.title;
    alertDialogComponent.message = config.message;

    if (config.closeButton) {
      alertDialogComponent.closeButton = config.closeButton;
    }

    return dialogRef;
  }

  /**
   * params:
   * - config: ConfirmDialogConfig {
   *     message: string;
   *     title?: string;
   *     viewContainerRef?: ViewContainerRef;
   *     acceptButton?: string;
   *     cancelButton?: string;
   * }
   *
   * Opens a confirm dialog with the provided config.
   * Returns an MatDialogRef<ConfirmDialogComponent> object.
   */
  public openConfirm(config: ConfirmDialogConfig): MatDialogRef<ConfirmDialog> {

    const dialogConfig: MatDialogConfig = this.createConfig(config);

    const dialogRef: MatDialogRef<ConfirmDialog> = this.dialog.open(ConfirmDialog, dialogConfig);
    const confirmDialogComponent: ConfirmDialog = dialogRef.componentInstance;
    confirmDialogComponent.title = config.title;
    confirmDialogComponent.message = config.message;

    if (config.acceptButton) {
      confirmDialogComponent.acceptButton = config.acceptButton;
    }
    if (config.cancelButton) {
      confirmDialogComponent.cancelButton = config.cancelButton;
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

// https://github.com/angular/components/blob/master/src/material/dialog/dialog.ts
// https://github.com/angular/components/blob/master/src/material/dialog/dialog-config.ts
