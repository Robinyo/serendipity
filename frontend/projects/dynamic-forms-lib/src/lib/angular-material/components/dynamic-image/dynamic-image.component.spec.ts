import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicImageComponent } from './dynamic-image.component';

describe('DynamicImageComponent', () => {
  let component: DynamicImageComponent;
  let fixture: ComponentFixture<DynamicImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
