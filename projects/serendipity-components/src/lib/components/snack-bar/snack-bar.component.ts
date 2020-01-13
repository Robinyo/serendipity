import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'crm-toast',
  template: `
    <span>
      {{ data.message }}
    </span>
  `,
  styles: []
})
export class SnackBarComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

}
