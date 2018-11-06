import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormsComponent } from './dynamic-forms.component';

describe('DynamicFormsComponent', () => {
  let component: DynamicFormsComponent;
  let fixture: ComponentFixture<DynamicFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
