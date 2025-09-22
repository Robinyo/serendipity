import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerendipityWorkflowLib } from './serendipity-workflow-lib';

describe('SerendipityWorkLib', () => {
  let component: SerendipityWorkflowLib;
  let fixture: ComponentFixture<SerendipityWorkflowLib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerendipityWorkflowLib]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerendipityWorkflowLib);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
