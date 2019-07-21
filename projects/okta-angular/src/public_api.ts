/*
 * Public API Surface of okta-angular
 */

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

/*

// Okta View Components
// export { OktaCallbackComponent, OktaLoginRedirectComponent } from './lib/components';
// BUILD ERROR : Unexpected value 'undefined' exported by the module
// https://github.com/angular/angular-cli/issues/10967
// If you're using index.ts files for your imports/exports you may want to try removing them and referring to your imports directly.

export { OktaCallbackComponent }      from './lib/components/callback.component';
export { OktaLoginRedirectComponent } from './lib/components/login-redirect.component';

export { OktaAuthModule }  from './lib/okta-auth.module';
export { OktaAuthGuard }   from './lib/guards/okta-auth.guard';
export { OktaAuthService } from './lib/services/okta-auth.service';
export { OKTA_CONFIG }     from './lib/models/okta.config';
export { UserClaims }      from './lib/models/user-claims';

*/

export * from './lib/components/authorization-code/authorization-code.component';
export * from './lib/components/implicit-callback/implicit-callback.component';
export * from './lib/components/login-redirect/login-redirect.component';

export * from './lib/services/auth/okta-auth.service';
export * from './lib/guards/auth/okta-auth.guard';

export * from './lib/models/okta.config';
export * from './lib/models/user-claims';

export * from './lib/okta-auth.module';
