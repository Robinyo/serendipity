import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Observable} from 'rxjs';
import { tap } from 'rxjs/operators';

import { HttpOptions } from 'serendipity-utils-lib';

import { CollectionService } from '../collection/collection';

@Injectable({
  providedIn: 'root'
})
export class ProcessesService extends CollectionService {

  constructor() {
    super();
  }

}
