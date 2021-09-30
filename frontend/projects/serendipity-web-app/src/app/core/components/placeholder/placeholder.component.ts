import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

/*

  // public url: Observable<string> | undefined;
  // this.url = route.url.pipe(map(segments => segments.join('')));

  // this.url = window.location.href;

*/
