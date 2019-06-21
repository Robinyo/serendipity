import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParliamentChartComponent } from './parliament-chart.component';

describe('ParliamentChartComponent', () => {
  let component: ParliamentChartComponent;
  let fixture: ComponentFixture<ParliamentChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParliamentChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParliamentChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
