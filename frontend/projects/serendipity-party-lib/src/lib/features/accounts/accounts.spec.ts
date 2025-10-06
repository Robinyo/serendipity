import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Accounts } from './accounts';

describe('Accounts', () => {
  let component: Accounts;
  let fixture: ComponentFixture<Accounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Accounts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Accounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
