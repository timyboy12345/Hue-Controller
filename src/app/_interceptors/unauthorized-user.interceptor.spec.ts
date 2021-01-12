import { TestBed } from '@angular/core/testing';

import { UnauthorizedUserInterceptor } from './unauthorized-user.interceptor';

describe('UnauthorizedUserInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      UnauthorizedUserInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: UnauthorizedUserInterceptor = TestBed.inject(UnauthorizedUserInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
