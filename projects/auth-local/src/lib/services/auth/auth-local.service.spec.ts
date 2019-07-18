import { TestBed } from '@angular/core/testing';

import { AuthLocalService } from './auth-local.service';

describe('AuthLocalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthLocalService = TestBed.get(AuthLocalService);
    expect(service).toBeTruthy();
  });
});
