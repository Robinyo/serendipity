import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardWidgetsComponent } from './dashboard-widgets.component';

describe('DashboardWidgetsComponent', () => {
  let component: DashboardWidgetsComponent;
  let fixture: ComponentFixture<DashboardWidgetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardWidgetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
