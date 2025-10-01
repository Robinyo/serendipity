import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListFilter } from './task-list-filter';

describe('TaskListFilter', () => {
  let component: TaskListFilter;
  let fixture: ComponentFixture<TaskListFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskListFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
