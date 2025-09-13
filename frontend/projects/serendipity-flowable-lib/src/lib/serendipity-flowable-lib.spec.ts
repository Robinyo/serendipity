import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerendipityFlowableLib } from './serendipity-flowable-lib';

describe('SerendipityFlowableLib', () => {
  let component: SerendipityFlowableLib;
  let fixture: ComponentFixture<SerendipityFlowableLib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerendipityFlowableLib]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerendipityFlowableLib);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
