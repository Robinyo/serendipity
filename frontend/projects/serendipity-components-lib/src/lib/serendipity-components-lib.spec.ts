import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerendipityComponentsLib } from './serendipity-components-lib';

describe('SerendipityComponentsLib', () => {
  let component: SerendipityComponentsLib;
  let fixture: ComponentFixture<SerendipityComponentsLib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerendipityComponentsLib]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerendipityComponentsLib);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
