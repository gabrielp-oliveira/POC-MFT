import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinearLoadingProgressComponent } from './linear-loading-progress.component';

describe('LinearLoadingProgressComponent', () => {
  let component: LinearLoadingProgressComponent;
  let fixture: ComponentFixture<LinearLoadingProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinearLoadingProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinearLoadingProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
