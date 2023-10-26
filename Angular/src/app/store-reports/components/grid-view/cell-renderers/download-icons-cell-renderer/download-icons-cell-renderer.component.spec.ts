import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadIconsCellRendererComponent } from './download-icons-cell-renderer.component';

describe('DownloadIconsCellRendererComponent', () => {
  let component: DownloadIconsCellRendererComponent;
  let fixture: ComponentFixture<DownloadIconsCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadIconsCellRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadIconsCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
