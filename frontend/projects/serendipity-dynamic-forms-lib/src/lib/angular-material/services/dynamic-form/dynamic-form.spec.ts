import { TestBed } from '@angular/core/testing';

import { DynamicForm } from './dynamic-form';

describe('DynamicForm', () => {
  let service: DynamicForm;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicForm);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
