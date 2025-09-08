import { TestBed } from '@angular/core/testing';

import { Collection } from './collection';

describe('Collection', () => {
  let service: Collection;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Collection);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
