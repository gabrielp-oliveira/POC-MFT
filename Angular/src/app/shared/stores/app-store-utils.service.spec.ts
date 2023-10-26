import { TestBed } from '@angular/core/testing';

import { AppStoreUtilsService } from './app-store-utils.service';

describe('AppStoreUtilsService', () => {
  let service: AppStoreUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppStoreUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
