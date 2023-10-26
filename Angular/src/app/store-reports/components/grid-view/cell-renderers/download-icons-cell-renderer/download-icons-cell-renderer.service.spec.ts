import { TestBed } from '@angular/core/testing';

import { DownloadIconsCellRendererService } from './download-icons-cell-renderer.service';

describe('DownloadIconsCellRendererService', () => {
  let service: DownloadIconsCellRendererService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadIconsCellRendererService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
