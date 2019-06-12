import { TestBed } from '@angular/core/testing';

import { MockDashboardService } from './mock-dashboard.service';

describe('MockDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MockDashboardService = TestBed.get(MockDashboardService);
    expect(service).toBeTruthy();
  });
});
