import { TestBed } from '@angular/core/testing';

import { ElectoralDivisionsService } from './electoral-divisions.service';

describe('ElectoralDivisionsService', () => {
  let service: ElectoralDivisionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectoralDivisionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
