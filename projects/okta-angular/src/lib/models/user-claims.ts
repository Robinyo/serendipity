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

export interface UserClaims {
  auth_time?: Number;
  aud?: string;
  email?: string;
  email_verified?: Boolean;
  exp?: Number;
  family_name?: string;
  given_name?: string;
  iat?: Number;
  iss?: string;
  jti?: string;
  locale?: string;
  name?: string;
  nonce?: string;
  preferred_username?: string;
  sub: string;
  updated_at?: Number;
  ver?: Number;
  zoneinfo?: string;
  [propName: string]: any;  // For custom claims that may be configured by the org admin
}
