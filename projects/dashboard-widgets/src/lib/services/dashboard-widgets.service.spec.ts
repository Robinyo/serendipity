import { TestBed } from '@angular/core/testing';

import { DashboardWidgetsService } from './dashboard-widgets.service';

describe('DashboardWidgetsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboardWidgetsService = TestBed.get(DashboardWidgetsService);
    expect(service).toBeTruthy();
  });
});
