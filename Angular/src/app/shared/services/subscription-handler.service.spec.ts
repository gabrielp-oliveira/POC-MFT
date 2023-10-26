import { TestBed } from '@angular/core/testing';

import { SubscriptionHandlerService } from './subscription-handler.service';

describe('SubscriptionHandlerService', () => {
  let service: SubscriptionHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
