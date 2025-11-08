import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRelationshipDialog } from './add-relationship-dialog';

describe('AddRelationshipDialog', () => {
  let component: AddRelationshipDialog;
  let fixture: ComponentFixture<AddRelationshipDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRelationshipDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRelationshipDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
