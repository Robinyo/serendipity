import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// import { EmailService } from '../../services/email/email.service';
// private emailService: EmailService,

import { LoggerService } from 'utils';

@Component({
  selector: 'sales-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {

  constructor(private router: Router,
              private logger: LoggerService) {}

  ngOnInit() {

    this.logger.info('ActivitiesComponent: ngOnInit()');
  }

  //
  // Command Bar events
  //

  public onEmail() {

    this.logger.info('ActivitiesComponent: onEmail()');

    this.router.navigate(['sales/activities/email']);
  }

}
