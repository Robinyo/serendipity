import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  templateUrl: './placeholder.component.html',
  styleUrls: ['./placeholder.component.scss']
})
export class PlaceholderComponent {

  public url: string | undefined;

  constructor(router: Router) {
    this.url = router.url;
  }

}
