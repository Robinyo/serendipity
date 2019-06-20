import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBarComponent } from './activity-bar.component';

describe('ActivityBarComponent', () => {
  let component: ActivityBarComponent;
  let fixture: ComponentFixture<ActivityBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
