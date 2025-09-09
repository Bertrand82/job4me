import { TestBed } from '@angular/core/testing';

import { HTTPBackendClientService } from './httpbackend-client-service';

describe('HTTPBackendClientService', () => {
  let service: HTTPBackendClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HTTPBackendClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
