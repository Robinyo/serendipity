import { TestBed } from '@angular/core/testing';

import { DynamicFormMetadataService } from './form-metadata.service';

describe('FormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DynamicFormMetadataService = TestBed.get(DynamicFormMetadataService);
    expect(service).toBeTruthy();
  });
});
