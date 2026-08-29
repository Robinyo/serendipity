import { Component, input } from '@angular/core';

import { AbstractComponent } from '../component/component';

@Component({
  template: '' // Abstract container shell marker
})
export abstract class AbstractItem<T> extends AbstractComponent {

  // ⚡ THE MODERN AUTOMATED BINDING:
  // Because your route path is 'contacts/:id', Angular automatically binds the URL value
  // straight into this input signal! No subscriptions, no lifecycle hooks, no memory leaks.
  public id = input.required<string>();

}



/*

  // Optional: Maintain a plain JavaScript getter if legacy code requires it
  public get publicId(): string {
    return this.id();
  }

*/
