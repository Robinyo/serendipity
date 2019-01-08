import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription} from 'rxjs';
import { first } from 'rxjs/operators';

import { DynamicFormModel, DynamicFormService } from 'dynamic-forms';

import { AuthService } from 'auth';

import { LoggerService } from 'utils';

@Component({
  selector: 'crm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public signInButton = 'SIGN IN';

  public formGroup: FormGroup;
  public formModel: DynamicFormModel;

  protected subscriptions: Subscription[] = [];

  private returnUrl: string;

  constructor(private authService: AuthService,
              private dynamicFormService: DynamicFormService,
              private route: ActivatedRoute,
              private router: Router,
              private logger: LoggerService) {}

  public ngOnInit() {

    this.logger.info('LoginComponent: ngOnInit()');

    if (this.authService.isAuthenticated()) {

      this.router.navigate(['/']);

    } else {

      this.subscribe();
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

  }

  protected subscribe() {

    this.logger.info('LoginComponent: subscribe()');

    let formSubscription: Subscription = new Subscription();
    this.subscriptions.push(formSubscription);

    formSubscription = this.dynamicFormService.getFormMetadata('login').subscribe(metaData => {

      this.formModel = metaData;
      this.formGroup = this.dynamicFormService.createGroup(this.formModel);
    });

  }

  protected unsubscribe(): void {

    this.logger.info('LoginComponent: unsubscribe()');

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

  }

  public ngOnDestroy() {

    this.logger.info('LoginComponent: ngOnDestroy()');
    this.unsubscribe();
  }

  //
  // Misc
  //

  public isValid() {

    let valid = true;

    if (this.formGroup) {
      valid = this.formGroup.valid;
    }

    return valid;

  }

  //
  // Command events
  //

  public onSubmit() {

    const username = this.formGroup.controls.username.value;
    const password = this.formGroup.controls.password.value;

    this.authService.login(username, password).pipe(first()).subscribe(data => {

        this.router.navigate([this.returnUrl]);

      },
      error => {
        this.logger.error('LoginComponent: onSubmit()');
      });

  }

}

// https://github.com/cornflourblue/angular-7-registration-login-example-cli/blob/master/src/app/login/login.component.ts

// https://github.com/okta/okta-oidc-js/blob/master/packages/okta-angular/src/okta/services/okta.service.ts
