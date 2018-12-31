import { TestBed } from '@angular/core/testing';

import { FormsService } from './forms.service';

describe('FormsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormsService = TestBed.get(FormsService);
    expect(service).toBeTruthy();
  });
});
