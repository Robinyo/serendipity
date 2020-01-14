import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { tap } from 'rxjs/operators';

import { LoggerService } from 'utils';

const HTTP_SERVER_ERROR_CONNECTION_REFUSED = 'Connection refused';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  // private keycloakAdminUriPrefix = 'http://localhost:10001/auth/admin/';
  private keycloakAdminUriPrefix = '/auth/admin/';

  protected httpOptions = null;

  constructor(protected httpClient: HttpClient,
              protected logger: LoggerService) {

  }

  public resetPassword(id: string, value: string, temporary: boolean = false) {

    this.logger.info('ProfileService: resetPassword()');

    // PUT /{realm}/users/{id}/reset-password
    // http://localhost:10001/auth/admin/realms/development/users

    const endpoint = `${this.keycloakAdminUriPrefix}realms/development/users/${id}/reset-password`;

    const credential = {
      type: 'password',
      value: value,
      temporary: temporary
    };

    return this.httpClient.post<any>(endpoint, credential, this.getHttpOptions()).pipe(

      tap(() => {

        this.logger.info('ProfileService: completeTask() completed');

      })).toPromise().catch(error => {

      if (error === undefined) {
        error = new Error(HTTP_SERVER_ERROR_CONNECTION_REFUSED);
      }

      throw error;

    });

  }

  protected getHttpOptions(params: HttpParams = null) {

    this.logger.info('ProfileService: getHttpOptions()');

    if (!this.httpOptions) {

      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        params: null
      };

    }

    this.httpOptions.params = params;

    this.logger.info('httpOptions: ' + JSON.stringify(this.httpOptions, null, 2));

    return this.httpOptions;
  }

}

// http://localhost:10001/auth/realms/development/account/

// https://github.com/v-ladynev/keycloak-nodejs-example/blob/master/lib/adminClient.js

/*

function resetUserPassword(client, realm, user) {
    // set password 'test_user' for a user
    return client.users.resetPassword(realm, user.id, {
        type: 'password',
        value: 'test_user'
    });
}

*/

/*

// curl-examples.txt

export ACCESS_TOKEN=$(curl -X POST 'http://localhost:10001/auth/realms/master/protocol/openid-connect/token' \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin" \
  -d 'password=secret' \
  -d 'grant_type=password' \
  -d 'client_id=admin-cli' | jq -r '.access_token')

echo $ACCESS_TOKEN

GET /{realm}/users

curl -X GET 'http://localhost:10001/auth/admin/realms/development/users' \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .

Output:

[
  {
    "id": "35129fce-98de-47e6-85cc-cdb81b46c0d2",
    "createdTimestamp": 1578541188081,
    "username": "rob.ferguson",
    "enabled": true,
    "totp": false,
    "emailVerified": false,
    "firstName": "Rob",
    "lastName": "Ferguson",
    "email": "rob.ferguson@robferguson.org",
    "federationLink": "b02e5323-0ea4-442c-ba59-5e997d0c5f94",
    "attributes": {
      "LDAP_ENTRY_DN": [
        "uid=rob.ferguson,ou=users,dc=flowable,dc=org"
      ],
      "LDAP_ID": [
        "rob.ferguson"
      ],
      "modifyTimestamp": [
        "20200109034239Z"
      ],
      "createTimestamp": [
        "20200109033948Z"
      ]
    },
    "disableableCredentialTypes": [],
    "requiredActions": [],
    "notBefore": 0,
    "access": {
      "manageGroupMembership": true,
      "view": true,
      "mapRoles": true,
      "impersonate": true,
      "manage": true
    }
  }
]

*/
