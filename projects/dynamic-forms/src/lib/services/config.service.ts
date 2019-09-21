export const DynamicFormsConfigService = 'Dynamic Forms Config';

/*

import { Injectable } from '@angular/core';

import { DynamicFormsModule } from '../dynamic-forms.module';

@Injectable({
  // providedIn: 'root'
  providedIn: DynamicFormsModule
})
export class DynamicFormsConfigService {}

*/

/*

// export const DynamicFormsConfigService = 'Dynamic Forms Config';

import { InjectionToken } from '@angular/core';

import { DynamicFormsConfig } from '../models/models';

import { DynamicFormsModule } from '../dynamic-forms.module';

export const DynamicFormsConfigService = new InjectionToken<DynamicFormsConfig>('DynamicFormsConfig');

// https://angular.io/api/core/InjectionToken#tree-shakable-injectiontoken

*/

/*

// export const DynamicFormsConfigService = 'Dynamic Forms Config';

import { InjectionToken } from '@angular/core';

import { DynamicFormsConfig } from '../models/models';

import { DynamicFormsModule } from '../dynamic-forms.module';

const config: DynamicFormsConfig = <any>{};

export const DynamicFormsConfigService = new InjectionToken<DynamicFormsConfig>('DynamicFormsConfig', {
  providedIn: DynamicFormsModule,
  factory: () => config
});

// https://angular.io/api/core/InjectionToken#tree-shakable-injectiontoken

*/
