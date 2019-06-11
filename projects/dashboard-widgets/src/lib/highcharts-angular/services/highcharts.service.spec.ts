import { TestBed } from '@angular/core/testing';

import { HighchartsService } from './highcharts.service';

describe('HighchartsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HighchartsService = TestBed.get(HighchartsService);
    expect(service).toBeTruthy();
  });
});
