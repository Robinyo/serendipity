<h1 align="center">Dynamic Forms</h1>

## ❯ Development

To build the library:

```
ng build utils && \
ng build dynamic-forms
```
### Basic Usage

1. Define your form ([login-form.json](https://github.com/Robinyo/serendipity/blob/master/projects/sales/src/assets/data/forms/en/login-form.json)):


```
[

  {
    "type": "input",
    "id": "username",
    "label": "Username",
    "placeholder": "flowable",
    "appearance": "fill",

    "validators": [
      {
        "name": "required",
        "args": null,
        "propertyName": "required",
        "message": "You must enter a username"
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

2. Use the `DynamicFormService` to create your form:

```
...

import { FormGroup } from '@angular/forms';
import { DynamicFormModel, DynamicFormService } from 'dynamic-forms';

import { AuthService } from 'auth';
import { LoggerService } from 'utils';

export const LOGIN_FORM = 'login-form';

export class LoginComponent implements OnInit, OnDestroy {

  public formGroup: FormGroup;
  public formModel: DynamicFormModel;

  private returnUrl: string;

  constructor(private authService: AuthService,
              private dynamicFormService: DynamicFormService,
              private route: ActivatedRoute,
              private router: Router,
              private logger: LoggerService) {}

  public ngOnInit() {

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
  
}
```

3. Add a `dynamic-form` to your template and bind its [className], [formGroup] and [model] properties:

```
<dynamic-form autocomplete="off"
              [className]="'nested-grid-container'"
              [formGroup]="formGroup"
              [model]="formModel">
</dynamic-form>
```



![divider](./divider.png)

## ❯ Screen Shots

The Auth [Local](https://github.com/Robinyo/serendipity/tree/master/projects/auth-local) library's **Sign In** form:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/login.png">
</p>

The [Flowable](https://github.com/Robinyo/serendipity/tree/master/projects/flowable) library's **Leave Application** form:

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
