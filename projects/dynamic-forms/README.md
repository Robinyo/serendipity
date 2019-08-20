# Dynamic Forms

![divider](./divider.png)

## ❯ Development

To build the library:

```
ng build utils && \
ng build dynamic-forms
```
### Declarative Form Layout

A basic form ([login-form.json](https://github.com/Robinyo/serendipity/blob/master/projects/sales/src/assets/data/forms/en/login-form.json)):

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
