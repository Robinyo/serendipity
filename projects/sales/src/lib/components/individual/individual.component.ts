import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

// import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription} from 'rxjs';

import { ContactsService } from '../../services/contacts/contacts.service';
import { Contact } from '../../shared/models';

import { LoggerService } from '../../services/logger/logger.service';

import {
  MARGIN_DESKTOP,
  TOOLBAR_HEIGHT_DESKTOP
} from '../../shared/constants';

@Component({
  selector: 'sales-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.scss']
})
export class IndividualComponent implements OnInit {

  public containerHeight: number;

  public id: string;

  public item: Contact;

  protected subscription: Subscription;

  @ViewChild('contentContainer')
  private tableContainer: ElementRef;

  cards = [
    { title: 'Contact Information', cols: 1, rows: 1 },
    { title: 'Card 2', cols: 1, rows: 1 },
    { title: 'Card 3', cols: 1, rows: 1 },
    { title: 'Card 4', cols: 1, rows: 1 }
  ];

  private toolbarHeight = TOOLBAR_HEIGHT_DESKTOP;
  private margin = MARGIN_DESKTOP;

  constructor(private route: ActivatedRoute,
              private breakpointObserver: BreakpointObserver,
              private contactsService: ContactsService,
              private logger: LoggerService) { }

  public ngOnInit() {

    this.logger.info('IndividualComponent: ngOnInit()');

    this.id = this.route.snapshot.paramMap.get('id');
    this.id = atob(this.id);

    this.subscribe();

    this.containerHeight = this.tableContainer.nativeElement.offsetHeight - (this.toolbarHeight * 2 + this.margin);
  }

  protected subscribe() {

    this.logger.info('IndividualComponent: subscribe()');

    this.subscription = this.contactsService.get(this.id).subscribe(data => {

      this.item = data;
      this.logger.info('this.item: ' + JSON.stringify(this.item));
    });

  }

}

// https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding

/*

  cards = this.breakpointObserver.observe(Breakpoints.HandsetPortrait).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Contact Information', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Contact Information', cols: 2, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );

*/
