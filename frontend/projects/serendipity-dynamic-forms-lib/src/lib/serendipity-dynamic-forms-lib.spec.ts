import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerendipityDynamicFormsLib } from './serendipity-dynamic-forms-lib';

describe('SerendipityDynamicFormsLib', () => {
  let component: SerendipityDynamicFormsLib;
  let fixture: ComponentFixture<SerendipityDynamicFormsLib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerendipityDynamicFormsLib]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerendipityDynamicFormsLib);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
