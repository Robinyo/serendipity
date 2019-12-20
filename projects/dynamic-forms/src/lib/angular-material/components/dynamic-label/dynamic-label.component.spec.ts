import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicLabelComponent } from './dynamic-label.component';

describe('DynamicLabelComponent', () => {
  let component: DynamicLabelComponent;
  let fixture: ComponentFixture<DynamicLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
