import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowableComponent } from './flowable.component';

describe('FlowableComponent', () => {
  let component: FlowableComponent;
  let fixture: ComponentFixture<FlowableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
