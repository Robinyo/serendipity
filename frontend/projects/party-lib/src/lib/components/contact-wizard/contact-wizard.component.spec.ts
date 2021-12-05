import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactWizardComponent } from './contact-wizard.component';

describe('ContactWizardComponent', () => {
  let component: ContactWizardComponent;
  let fixture: ComponentFixture<ContactWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
