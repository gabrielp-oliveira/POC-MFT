import { TestBed } from '@angular/core/testing';

import { MftService } from './mft.service';

describe('MftService', () => {
  let service: MftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
