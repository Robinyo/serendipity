import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactRelationshipList } from './contact-relationship-list';

describe('ContactRelationshipList', () => {
  let component: ContactRelationshipList;
  let fixture: ComponentFixture<ContactRelationshipList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactRelationshipList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactRelationshipList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
