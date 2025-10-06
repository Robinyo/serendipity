import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicLabel } from './dynamic-label';

describe('DynamicLabel', () => {
  let component: DynamicLabel;
  let fixture: ComponentFixture<DynamicLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicLabel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicLabel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
