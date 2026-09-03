import {Component, Directive, input} from '@angular/core';

import { AbstractComponent } from '../component/component';

// const ACCORDION = 'accordion';
const CARD = 'card';

@Directive()
export abstract class AbstractItem<T> extends AbstractComponent {

  // Because your route path is '/:id', Angular automatically binds the URL value
  // straight into this input signal! No subscriptions, no lifecycle hooks, no memory leaks.
  public id = input.required<string>();

  public metadata = input<any>();

  public item!: T;

  // public viewMode = ACCORDION;
  public viewMode = CARD;

  public schema: any;

  public selectedTabIndex = 0;

}



/*

  // Optional: Maintain a plain JavaScript getter if legacy code requires it
  public get publicId(): string {
    return this.id();
  }

*/
