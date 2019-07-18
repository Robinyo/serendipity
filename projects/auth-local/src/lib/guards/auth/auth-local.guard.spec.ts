import { TestBed, async, inject } from '@angular/core/testing';

import { AuthLocalGuard } from './auth-local.guard';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthLocalGuard]
    });
  });

  it('should ...', inject([AuthLocalGuard], (guard: AuthLocalGuard) => {
    expect(guard).toBeTruthy();
  }));
});
