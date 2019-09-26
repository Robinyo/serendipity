import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DynamicFormModel, DynamicFormService } from 'dynamic-forms';

import { AuthService } from 'auth';

import { LoggerService } from 'utils';

const LOGIN_FORM = 'username-password-form';

@Component({
  selector: 'auth-local-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public loginButton = 'SIGN IN';
  public registerButton = 'Sign up';

  public formGroup: FormGroup;
  public formModel: DynamicFormModel;

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

      this.createForm();
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

  }

  async createForm() {

    this.formModel = await this.dynamicFormService.getFormMetadata(LOGIN_FORM);
    this.formGroup = this.dynamicFormService.createGroup(this.formModel);
  }

  public ngOnDestroy() {
    this.logger.info('LoginComponent: ngOnDestroy()');
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

    this.authService.loginWithEmailAndPassword(this.formGroup.controls['username'].value,
      this.formGroup.controls['password'].value);
  }

  public onRegister() {

    this.router.navigate(['/register']);
  }

}

/*

    this.authService.loginWithEmailAndPassword(this.formGroup.controls['username'].value,
      this.formGroup.controls['password'].value);

*/
