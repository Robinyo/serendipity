import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerendipityWorkLib } from './serendipity-work-lib';

describe('SerendipityWorkLib', () => {
  let component: SerendipityWorkLib;
  let fixture: ComponentFixture<SerendipityWorkLib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerendipityWorkLib]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerendipityWorkLib);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
