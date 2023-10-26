import { TestBed } from '@angular/core/testing';

import { CompanyCodeFilterService } from './company-code-filter.service';

describe('CompanyCodeFilterService', () => {
  let service: CompanyCodeFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyCodeFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
