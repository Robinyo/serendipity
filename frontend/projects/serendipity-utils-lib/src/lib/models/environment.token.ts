import { InjectionToken } from '@angular/core';

import { Environment } from './environment';

// Create a stable token for the entire environment shape
export const APP_ENVIRONMENT = new InjectionToken<Environment>('APP_ENVIRONMENT');
