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

// import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { OktaAuthService } from './services/auth/okta-auth.service';
import { OktaConfig } from './models/okta.config';

export function createOktaService(document: any, config: OktaConfig, http: HttpClient, router: Router) {
  return new OktaAuthService(document, config, http, router);
}
