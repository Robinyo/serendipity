import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListFilterComponent } from './task-list-filter.component';

describe('TaskListFilterComponent', () => {
  let component: TaskListFilterComponent;
  let fixture: ComponentFixture<TaskListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
