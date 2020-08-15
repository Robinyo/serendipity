import { TestBed } from '@angular/core/testing';

import { ProcessesService } from './processes.service';

describe('ProcessesService', () => {
  let service: ProcessesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
