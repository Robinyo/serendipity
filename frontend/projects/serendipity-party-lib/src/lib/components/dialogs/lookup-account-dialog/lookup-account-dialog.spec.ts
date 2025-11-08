import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupAccountDialog } from './lookup-account-dialog';

describe('LookupAccountDialog', () => {
  let component: LookupAccountDialog;
  let fixture: ComponentFixture<LookupAccountDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LookupAccountDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LookupAccountDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
