import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthKeycloakComponent } from './auth-keycloak.component';

describe('AuthKeycloakComponent', () => {
  let component: AuthKeycloakComponent;
  let fixture: ComponentFixture<AuthKeycloakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthKeycloakComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthKeycloakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
