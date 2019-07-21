/*
 * Copyright (c) 2017-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { DOCUMENT } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { OktaAuthorizationCodeCallbackComponent } from './components/authorization-code/authorization-code.component';
import { OktaImplicitCallbackComponent } from './components/implicit-callback/implicit-callback.component';
import { OktaLoginRedirectComponent } from './components/login-redirect/login-redirect.component';

import { OktaAuthService } from './services/auth/okta-auth.service';
import { OktaAuthGuard } from './guards/auth/okta-auth.guard';
import { OktaConfig, OKTA_CONFIG } from './models/okta.config';
import { createOktaService } from './create-okta-service';

@NgModule({
  declarations: [
    OktaAuthorizationCodeCallbackComponent,
    OktaImplicitCallbackComponent,
    OktaLoginRedirectComponent
  ],
  exports: [
    OktaAuthorizationCodeCallbackComponent,
    OktaImplicitCallbackComponent,
    OktaLoginRedirectComponent
  ],
  providers: [
    OktaAuthGuard,
    {
      provide: OktaAuthService,
      useFactory: createOktaService,
      deps: [
        DOCUMENT,
        OKTA_CONFIG,
        HttpClient,
        Router
      ]
    }
  ]
})
export class OktaAuthModule {

  // Deprecated. Your app should provide OKTA_CONFIG directly
  static initAuth(config: OktaConfig): ModuleWithProviders {
    return {
      ngModule: OktaAuthModule,
      providers: [
        // Will NOT provide config when using AOT compiler. Your app module should provide this value statically in its providers section.
        { provide: OKTA_CONFIG, useValue: config }
      ]
    };
  }

}
