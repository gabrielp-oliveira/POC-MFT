import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCodeFilterComponent } from './company-code-filter.component';

describe('CompanyCodeFilterComponent', () => {
  let component: CompanyCodeFilterComponent;
  let fixture: ComponentFixture<CompanyCodeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyCodeFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyCodeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
