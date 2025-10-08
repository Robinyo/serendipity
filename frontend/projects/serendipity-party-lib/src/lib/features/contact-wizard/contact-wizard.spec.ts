import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactWizard } from './contact-wizard';

describe('ContactWizard', () => {
  let component: ContactWizard;
  let fixture: ComponentFixture<ContactWizard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactWizard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactWizard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
