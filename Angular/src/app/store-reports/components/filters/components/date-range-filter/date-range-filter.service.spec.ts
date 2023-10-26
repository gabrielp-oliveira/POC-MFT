import { TestBed } from '@angular/core/testing';

import { DateRangeFilterService } from './date-range-filter.service';

describe('DateRangeFilterService', () => {
  let service: DateRangeFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateRangeFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
