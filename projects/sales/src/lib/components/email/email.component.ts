import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';

import { ACTIVITIES } from '../../models/constants';

import { LoggerService } from 'utils';

@Component({
  selector: 'sales-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {

  constructor(private router: Router,
              private logger: LoggerService) {}

  ngOnInit() {

    this.logger.info('EmailComponent: ngOnInit()');
  }

  //
  // Misc
  //

  public canDeactivate(): Observable<boolean> | boolean {

    return true;
  }

  //
  // Command Bar events
  //

  public onClose() {

    this.logger.info('EmailComponent: onClose()');

    this.router.navigate([ACTIVITIES]);
  }

  public onSend() {

    this.logger.info('EmailComponent: onSend()');
  }

}
