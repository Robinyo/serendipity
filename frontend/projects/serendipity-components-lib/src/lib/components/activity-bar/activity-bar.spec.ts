import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBar } from './activity-bar';

describe('ActivityBar', () => {
  let component: ActivityBar;
  let fixture: ComponentFixture<ActivityBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
