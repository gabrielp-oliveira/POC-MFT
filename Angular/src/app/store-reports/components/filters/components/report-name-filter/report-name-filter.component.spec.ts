import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportNameFilterComponent } from './report-name-filter.component';

describe('ReportNameFilterComponent', () => {
  let component: ReportNameFilterComponent;
  let fixture: ComponentFixture<ReportNameFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportNameFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportNameFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
