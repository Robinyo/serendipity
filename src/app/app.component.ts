import { Component, OnInit, OnDestroy } from '@angular/core';

import { LoggerService } from 'utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private logger: LoggerService) {}

  public ngOnInit() {
    this.logger.info('AppComponent: ngOnInit()');
  }

  public ngOnDestroy() {
    this.logger.info('AppComponent: ngOnDestroy()');
  }

}

/*

    // this.translate.get('RESET_PASSWORD_MESSAGE').subscribe(value => {
    //   this.alertMessage = value;
    // });

import { LoggerService } from '@app/core';

  constructor(private logger: LoggerService) {

  }

*/
