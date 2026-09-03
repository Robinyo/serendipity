import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | boolean;
}

export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  // If the component implements canDeactivate(), execute it.
  // Otherwise, allow navigation.
  return component.canDeactivate ? component.canDeactivate() : true;
};
