<h1 align="center">Dynamic Forms</h1>

## ❯ Development

To build the library:

```
ng build utils && \
ng build dynamic-forms
```
### Basic Usage

1. Define your form ([username-password-form.json](https://github.com/Robinyo/serendipity/blob/master/projects/sales/src/assets/data/forms/en/username-password-form.json)):


```
[

  {
    "type": "input",
    "id": "username",
    "label": "Email",
    "appearance": "fill",

    "validators": [
      {
        "name": "email",
        "args": null,
        "propertyName": "email",
        "message": "Please enter a valid email address"
      }
    ],

    "gridItemClass": "grid-column-1",
    "required": true
  },
  {
    "type": "input",
    "inputType": "password",
    "id": "password",
    "label": "Password",
    "placeholder": "test",
    "appearance": "fill",

    "validators": [
      {
        "name": "required",
        "args": null,
        "propertyName": "required",
        "message": "You must enter a password"
      }
    ],

    "gridItemClass": "grid-column-1",
    "required": true
  }

]
```

2. Use the `DynamicFormService` to create your form ([login.component.ts](https://github.com/Robinyo/serendipity/blob/master/projects/auth-local/src/lib/components/login/login.component.ts)):

```
...

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
```

3. Add a `<dynamic-form>` to your template ([login.component.html](https://github.com/Robinyo/serendipity/blob/master/projects/auth-local/src/lib/components/login/login.component.html)) and bind its [formGroup] and [model] properties:

```
...

<dynamic-form autocomplete="off"
  className="nested-grid-container"
  [formGroup]="formGroup"
  [model]="formModel">
</dynamic-form>

...
```

![divider](./divider.png)

## ❯ Screen Shots

The Auth [Local](https://github.com/Robinyo/serendipity/tree/master/projects/auth-local) library's **Login** (Sign in) form:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/local-auth-login.png">
</p>

The Auth [Local](https://github.com/Robinyo/serendipity/tree/master/projects/auth-local) library's **Register** (Create account) form:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/local-auth-register.png">
</p>

The [Flowable](https://github.com/Robinyo/serendipity/tree/master/projects/flowable) library's Task Component displaying a sample **Leave Application** form:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/task-component.png"/>
</p>

![divider](./divider.png)

## ❯ Resources 

### Angular Form Libraries

* GitHub: [ng-dynamic-forms](https://github.com/udos86/ng-dynamic-forms)
* GitHub: [ngx-formly](https://github.com/formly-js/ngx-formly)
* GitHub: [angular-schema-form (AngularJS) - Generate forms from a JSON schema](https://github.com/json-schema-form/angular-schema-form)
* GitHub: [ngx-schema-form - HTML form generation based on JSON Schema](https://github.com/guillotinaweb/ngx-schema-form)
* GitHub: [angular2-json-schema-form - Angular 2 JSON Schema Form builder](https://github.com/dschnelldavis/angular2-json-schema-form)

### CSS Grid Layout

* CSS Tricks: [A Complete Guide to CSS Grid Layout](https://css-tricks.com/snippets/css/complete-guide-grid/)
* Grid By Example: [CSS Grid Layout by Example](https://gridbyexample.com/learn/)

![divider](./divider.png)
