export const UtilsConfigService = 'Utils Config';

// https://angular.io/api/core/InjectionToken

/*

import { InjectionToken } from '@angular/core';

import { UtilsConfig } from '../shared/models';

export const UtilsConfigService = new InjectionToken<UtilsConfig>('Utils Config');

*/

/*

import { UtilsModule } from '../utils.module';

const config: UtilsConfig = {};

export const UtilsConfigService = new InjectionToken<UtilsConfig>('Utils Config', {
  providedIn: UtilsModule,
  factory: () => config,
});

*/
