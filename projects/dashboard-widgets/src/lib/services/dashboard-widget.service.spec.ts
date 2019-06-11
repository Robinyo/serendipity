import { TestBed } from '@angular/core/testing';

import { DashboardWidgetService } from './dashboard-widget.service';

describe('DashboardWidgetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboardWidgetService = TestBed.get(DashboardWidgetService);
    expect(service).toBeTruthy();
  });
});
