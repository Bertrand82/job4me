import { TestBed } from '@angular/core/testing';

import { BgBackFunctions } from './bg-back-functions';

describe('BgBackFunctions', () => {
  let service: BgBackFunctions;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BgBackFunctions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
