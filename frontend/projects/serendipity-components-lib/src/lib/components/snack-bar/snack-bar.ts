import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'snack-bar',
  imports: [],
  template: `
    <span>
      {{ data.message }}
    </span>
  `
})
export class SnackBar {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

}
