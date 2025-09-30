import { Component, EventEmitter, inject, Output } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { List } from 'serendipity-components-lib';

import { ProcessesService } from '../../services/processes/processes';
import { ProcessListModel, ProcessModel } from '../../models/process-list';

@Component({
  selector: 'workflow-process-list',
  imports: [
    MatIconModule,
    MatListModule
  ],
  template: `
    <div class="process-list-container">

      <mat-nav-list style="padding-top: 0">

        @for (item of items; track item.id) {

          <a mat-list-item
             class="md-nav-list-item"
             [activated]="item.id === selectedItem.id"
             (click)="onSelect(item)">

            <mat-icon matListItemIcon> assignment </mat-icon>

            <p>
              {{item.name}}
            </p>

          </a>

        }

      </mat-nav-list>

    </div>
  `,
  styleUrls: ['./process-list.scss']
})
export class ProcessList extends List<ProcessModel> {

  @Output() selectEvent = new EventEmitter<ProcessModel>();

  private count = 0;
  private processesService: ProcessesService = inject(ProcessesService);

  constructor() {

    super();

    this.logger.info('Process List Component');

  }

  protected subscribe() {

    this.logger.info('Process List Component: subscribe()');

    // this.isLoading = true;

    this.subscription = this.processesService.find().subscribe(

      (response: ProcessListModel) => {

        this.logger.info('Process List Component: subscribe() success handler');

        if (response.data && response.data.length) {
          this.count = response.data.length;
        }

        this.logger.info('count: ' + this.count + ' Processes');

        if (this.count > 0) {

          // @ts-ignore
          this.items = response.data;
          this.selectedItem = this.items[0];
          this.selectEvent.emit(this.selectedItem);

        } else {

          this.items = [];
          // this.items.push(new ProcessModel());

        }

        this.logger.info('items: ' + JSON.stringify(this.items, null, 2))

      },
      (error) => {

        this.logger.error('Process List Component: subscribe() error handler');

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

        this.logger.info('Process List Component: subscribe() completion handler');
      }

    );

  }

  //
  // Command events
  //

  public override onSelect(item: any) {

    super.onSelect(item);

    this.logger.info('Process List Component: onSelect()');

    if (this.selectedItem != null) {
      this.selectEvent.emit(this.selectedItem);
    }

  }

}
