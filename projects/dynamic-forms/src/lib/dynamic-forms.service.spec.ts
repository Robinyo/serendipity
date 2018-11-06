import { TestBed } from '@angular/core/testing';

import { DynamicFormsService } from './dynamic-forms.service';

describe('DynamicFormsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DynamicFormsService = TestBed.get(DynamicFormsService);
    expect(service).toBeTruthy();
  });
});
