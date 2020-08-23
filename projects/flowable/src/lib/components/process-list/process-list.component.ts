import { Component, EventEmitter, Output } from '@angular/core';

import { Subscription } from 'rxjs';

import { DialogService } from 'serendipity-components';

import { CollectionComponent } from '../abstract/collection/collection.component';
import { ProcessListModel, ProcessModel } from '../../models/process-list.model';
import { ProcessesService } from '../../services/processes/processes.service';

@Component({
  selector: 'flow-process-list',
  templateUrl: './process-list.component.html',
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

        this.items = model.data;

        if (this.items && this.items.length) {
          this.selectedItem = this.items[0];
          this.selectEvent.emit(this.selectedItem);
        }

      },
      (error) => {

        this.logger.error('ProcessListComponent: subscribe() error handler');

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

        this.logger.info('ProcessListComponent: subscribe() completion handler');
      }

    );

  }

  //
  // Command events
  //

  public onSelect(item) {

    super.onSelect(item);

    this.logger.info('ProcessListComponent: onSelect()');

    this.selectEvent.emit(this.selectedItem);
  }

}
