import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicInput } from './dynamic-input';

describe('DynamicInput', () => {
  let component: DynamicInput;
  let fixture: ComponentFixture<DynamicInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
