import { TestBed } from '@angular/core/testing';

import { FormMetadataService } from './form-metadata.service';

describe('FormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormMetadataService = TestBed.get(FormMetadataService);
    expect(service).toBeTruthy();
  });
});
