import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandBar } from './command-bar';

describe('CommandBar', () => {
  let component: CommandBar;
  let fixture: ComponentFixture<CommandBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
