import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Activities } from './activities';

describe('Activities', () => {
  let component: Activities;
  let fixture: ComponentFixture<Activities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Activities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Activities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
