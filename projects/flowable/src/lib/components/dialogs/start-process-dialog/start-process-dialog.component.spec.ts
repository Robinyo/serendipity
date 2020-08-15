import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartProcessDialogComponent } from './start-process-dialog.component';

describe('StartProcessDialogComponent', () => {
  let component: StartProcessDialogComponent;
  let fixture: ComponentFixture<StartProcessDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartProcessDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartProcessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
