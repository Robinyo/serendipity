import { Component, Inject, OnInit } from '@angular/core';

import * as OktaSignIn from '@okta/okta-signin-widget';

// import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
// import '@okta/okta-signin-widget/dist/css/okta-theme.css';

import { AuthConfig } from '../../models/models';
import { AuthConfigService } from '../../services/config.service';


@Component({
  selector: 'auth-okta-signin',
  templateUrl: './okta-signin.component.html',
  styleUrls: ['./okta-signin.component.scss']
})
export class OktaSigninComponent implements OnInit {

  signIn: any;

  constructor(@Inject(AuthConfigService) private config: AuthConfig) {

    this.signIn = new OktaSignIn({
      /**
       * Note: when using the Sign-In Widget for an ODIC flow, it still
       * needs to be configured with the base URL for your Okta Org. Here
       * we derive it from the given issuer for convenience.
       */
      baseUrl: config.oidc.issuer.split('/oauth2')[0],
      clientId: config.oidc.clientId,
      redirectUri: config.oidc.redirectUri,
      logo: '/assets/images/icons/favicon-32x32.png',
      i18n: {
        en: {
          'primaryauth.title': 'Serendipity CRM',
        },
      },
      authParams: {
        responseType: ['id_token', 'token'],
        issuer: config.oidc.issuer,
        display: 'page',
        scopes: config.oidc.scope.split(' '),
      },
    });
  }

  ngOnInit() {

    this.signIn.renderEl(
      { el: '#sign-in-widget' },
      () => {
        /**
         * In this flow, the success handler will not be called because we redirect
         * to the Okta org for the authentication workflow.
         */
      },
      (err) => {
        throw err;
      },
    );

  }

}

// https://developer.okta.com/code/javascript/okta_sign-in_widget/
