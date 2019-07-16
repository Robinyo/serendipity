import { TestBed, async, inject } from '@angular/core/testing';

import { AuthOktaGuard } from './auth-okta.guard';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthOktaGuard]
    });
  });

  it('should ...', inject([AuthOktaGuard], (guard: AuthOktaGuard) => {
    expect(guard).toBeTruthy();
  }));
});
