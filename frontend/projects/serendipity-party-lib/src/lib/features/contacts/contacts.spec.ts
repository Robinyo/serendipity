import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { Contacts } from './contacts';
import { ContactModel } from '../../models/contact';

describe('Contacts', () => {
  let component: Contacts;
  let fixture: ComponentFixture<Contacts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contacts]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Contacts);
    component = fixture.componentInstance;
  });

  it('should create', () => {

    component.columnDefs = [
      { name: 'party.displayName', displayName: 'Name', routerLink: 'party.id', class: '' },
      { name: 'email', displayName: 'Email', routerLink: '', class: '' },
      { name: 'organisation.displayName', displayName: 'Organisation', routerLink: 'organisation.id', class: '' },
      { name: 'organisation.phoneNumber', displayName: 'Phone', routerLink: '', class: '' }
    ];

    // Keep your displayed list arrays matching your component rulesets
    component.displayedColumns = ['id', 'party.displayName', 'email', 'organisation.displayName', 'organisation.phoneNumber'];

    // Instantiate a proper MatTableDataSource wrapper to satisfy strict type-checking
    component.dataSource = new MatTableDataSource<ContactModel>([]);

    // Now trigger change detection safely once properties are bound
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
