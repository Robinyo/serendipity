import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DynamicFormModel, DynamicFormService } from 'dynamic-forms';

import { AuthService } from 'auth';

import { LOGIN_FORM } from '../../constants/form-ids';

import { DialogService } from 'serendipity-components';

import { LoggerService } from 'utils';

@Component({
  selector: 'auth-local-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public formGroup: FormGroup;
  public formModel: DynamicFormModel;

  private returnUrl: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private dialogService: DialogService,
              private dynamicFormService: DynamicFormService,
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

    // <dynamic-form (keyup.enter)="onSubmit()" ... >

    if (this.isValid()) {

      this.authService.loginWithEmailAndPassword(this.formGroup.controls['username'].value,
        this.formGroup.controls['password'].value).catch(error => {

        const message = error.details.message ? error.details.message : error.message;

        this.dialogService.openAlert({
          title: 'Alert',
          message: message,
          closeButton: 'CLOSE'
        });

      });

    }

  }

  public onRegister() {

    this.router.navigate(['/register']);
  }

}

/*

          if (error.details.message) {
            window.alert(error.details.message);
          } else {
            window.alert(error.message);
          }


*/
