import { TestBed } from '@angular/core/testing';

import { StoreFilterService } from './store-filter.service';

describe('StoreFilterService', () => {
  let service: StoreFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
