import { TestBed } from '@angular/core/testing';

import { HasUsernameGuardGuard } from './has-username-guard.guard';

describe('HasUsernameGuardGuard', () => {
  let guard: HasUsernameGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HasUsernameGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
