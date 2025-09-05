import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerendipityPartyLib } from './serendipity-party-lib';

describe('SerendipityPartyLib', () => {
  let component: SerendipityPartyLib;
  let fixture: ComponentFixture<SerendipityPartyLib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerendipityPartyLib]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerendipityPartyLib);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
