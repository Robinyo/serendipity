import { MAT_DATE_LOCALE } from '@angular/material';
import { environment } from '@env/environment';

export const angularMaterialProviders = [

  {
    provide: MAT_DATE_LOCALE,
    useValue: environment.defaultLanguage
  }

];
