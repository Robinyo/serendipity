import { TestBed } from '@angular/core/testing';

import { AuthOktaService } from './auth-okta.service';

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthOktaService = TestBed.get(AuthOktaService);
    expect(service).toBeTruthy();
  });
});
