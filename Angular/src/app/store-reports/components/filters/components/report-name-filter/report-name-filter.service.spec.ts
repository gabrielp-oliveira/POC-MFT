import { TestBed } from '@angular/core/testing';

import { ReportNameFilterService } from './report-name-filter.service';

describe('ReportNameFilterService', () => {
  let service: ReportNameFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportNameFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
