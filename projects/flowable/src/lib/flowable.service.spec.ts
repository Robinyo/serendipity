import { TestBed } from '@angular/core/testing';

import { FlowableService } from './flowable.service';

describe('FlowableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlowableService = TestBed.get(FlowableService);
    expect(service).toBeTruthy();
  });
});
