import { MatIconRegistry } from '@angular/material/icon';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
// import { provideRouterMock } from '@angular/router/testing'; // Add this import
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

export default [
  provideHttpClient(),
  provideHttpClientTesting(),
  // provideRouterMock(), // Automatically injects ActivatedRoute/Router mocks everywhere
  provideRouter([]),

  {
    provide: MatIconRegistry,
    useValue: {
      getNamedSvgIcon: () => of(document.createElementNS('http://w3.org', 'svg')),
      addSvgIcon: () => {},
      addSvgIconLiteral: () => {},
      addSvgIconInNamespace: () => {},
      getDefaultFontSetClass: () => [],
      getFontSetClassNameByAlias: () => ''
    }
  }
];
