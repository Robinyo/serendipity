import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { vi } from 'vitest'; // Import Vitest spying tools

import { ContactsService } from '../../services/contacts/contacts';

import { Contact } from './contact';

import contactFormSchema from '../../../assets/data/forms/contact-information-vertical-layout-form.json';
import realContactPayload from '../../../assets/data/mocks/contact.json';

describe('Contact', () => {
  let component: Contact;
  let fixture: ComponentFixture<Contact>;
  let contactsService: ContactsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contact],
      providers: [
        ContactsService,
        {
          provide: ActivatedRoute,
          useValue: {
            // 1. Mock paramMap as an observable stream for the base Item class ngOnInit [1]
            // We pass an encoded '123' string using btoa() because item.ts runs atob(identity)
            paramMap: of({
              get: (key: string) => key === 'id' ? btoa('89') : null
            }),

            // 2. Keep the snapshot configuration for your local form schema lookup
            snapshot: {
              data: {
                metaData: {
                  generalInformationFormDefs: contactFormSchema
                }
              },
              params: { id: btoa('89') }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Contact);
    component = fixture.componentInstance;
    contactsService = TestBed.inject(ContactsService);
  });

  it('should create', () => {
    // 3. Spy on the now correctly mapped service instance
    // @ts-ignore
    vi.spyOn(contactsService, 'findById').mockReturnValue(of(realContactPayload));

    // 4. Trigger change detection safely
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

});
