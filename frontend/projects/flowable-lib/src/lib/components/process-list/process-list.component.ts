import { Component, EventEmitter, Output } from '@angular/core';

import { Subscription } from 'rxjs';

import { DialogService } from 'serendipity-components-lib';

import { ProcessesService } from '../../services/processes/processes.service';

import { CollectionComponent } from '../abstract/collection/collection.component';
import { ProcessListModel, ProcessModel } from '../../models/process-list.model';

@Component({
  selector: 'flow-process-list',
  template: `
    <div class="process-list-container">

      <mat-nav-list style="padding-top: 0">

        <a *ngFor="let item of items"
           mat-list-item
           [class.list-item-active]="item === selectedItem"
           (click)="onSelect(item)">

          <mat-icon matListIcon svgIcon="assignment" class="task-list-icon"> </mat-icon>

          <p mat-line>
            {{item.name}}
          </p>

        </a>

      </mat-nav-list>

    </div>
  `,
  styleUrls: ['./process-list.component.scss']
})
export class ProcessListComponent extends CollectionComponent<ProcessModel> {

  @Output() selectEvent = new EventEmitter<ProcessModel>();

  constructor(private dialogService: DialogService,
              private processesService: ProcessesService) {
    super();
  }

  protected subscribe() {

    this.logger.info('ProcessListComponent: subscribe()');

    let modelSubscription: Subscription = new Subscription();
    this.subscriptions.push(modelSubscription);

    modelSubscription = this.processesService.find().subscribe(

      (model: ProcessListModel) => {

        this.logger.info('ProcessListComponent: subscribe() success handler');

        // @ts-ignore
        this.items = model.data;

        if (this.items && this.items.length) {
          this.selectedItem = this.items[0];
          this.selectEvent.emit(this.selectedItem);
        }

      },
      (error) => {

        this.logger.error('ProcessListComponent: subscribe() error handler');

        this.items = [];
        // this.selectedItem = null;

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

        this.logger.info('ProcessListComponent: subscribe() completion handler');
      }

    );

  }

  //
  // Command events
  //

  public onSelect(item: any) {

    super.onSelect(item);

    this.logger.info('ProcessListComponent: onSelect()');

    if (this.selectedItem != null) {
      this.selectEvent.emit(this.selectedItem);
    }

  }

}
