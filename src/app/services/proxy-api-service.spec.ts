import { TestBed } from '@angular/core/testing';

import { ProxyApiService } from './proxy-api-service';

describe('ProxyApiService', () => {
  let service: ProxyApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProxyApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
