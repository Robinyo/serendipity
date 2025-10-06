import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicForm } from './dynamic-form';

describe('DynamicForm', () => {
  let component: DynamicForm;
  let fixture: ComponentFixture<DynamicForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
