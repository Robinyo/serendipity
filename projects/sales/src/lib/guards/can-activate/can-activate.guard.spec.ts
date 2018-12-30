import { TestBed, async, inject } from '@angular/core/testing';

import { CanActivateGuard } from './can-activate.guard';

describe('CanActivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateGuard]
    });
  });

  it('should ...', inject([CanActivateGuard], (guard: CanActivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});
