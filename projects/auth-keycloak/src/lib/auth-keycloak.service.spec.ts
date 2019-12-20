import { TestBed } from '@angular/core/testing';

import { AuthKeycloakService } from './auth-keycloak.service';

describe('AuthKeycloakService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthKeycloakService = TestBed.get(AuthKeycloakService);
    expect(service).toBeTruthy();
  });
});
