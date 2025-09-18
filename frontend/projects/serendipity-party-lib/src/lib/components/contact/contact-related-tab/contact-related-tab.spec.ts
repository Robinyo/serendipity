import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactRelatedTab } from './contact-related-tab';

describe('ContactRelatedTab', () => {
  let component: ContactRelatedTab;
  let fixture: ComponentFixture<ContactRelatedTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactRelatedTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactRelatedTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
