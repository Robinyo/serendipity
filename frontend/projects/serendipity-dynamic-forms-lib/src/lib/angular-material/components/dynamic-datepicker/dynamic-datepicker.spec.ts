import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDatepicker } from './dynamic-datepicker';

describe('DynamicDatepicker', () => {
  let component: DynamicDatepicker;
  let fixture: ComponentFixture<DynamicDatepicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicDatepicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicDatepicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
