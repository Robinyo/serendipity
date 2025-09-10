<h1 align="center">Progressive Web App</h1>

## ❯ Introduction

A Progressive Web App (PWA) is a type of web application that provides a user experience similar to a native app, 
allowing users to install it on their device for offline access, push notifications, and quick launch from the 
home screen. 

Built with web technologies like HTML, CSS, and JavaScript, PWAs run across all devices and platforms from a single 
codebase, adapting to device capabilities to provide a customized, reliable, and engaging experience.

For more information:
- [web.dev](https://web.dev/explore/progressive-web-apps)
- [mdn](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

## ❯ Angular

### Setting up for a multi-project workspace

If you intend to have multiple projects in a workspace, you can skip the initial application generation when you create 
the workspace, and give the workspace a unique name. The following command creates a workspace with all of the 
workspace-wide configuration files, but no root-level application.

```
ng new frontend --no-create-application
```

You can then generate applications and libraries with names that are unique within the workspace.

For example:

```
cd frontend
ng generate application serendipity-pwa
ng generate library serendipity-auth-lib
ng generate library serendipity-party-lib
ng generate library serendipity-work-lib
ng generate library serendipity-utils-lib
```

### Multiple project file structure

The first explicitly generated application goes into the `/projects` folder along with all other projects in the 
workspace. Newly generated libraries are also added under projects.

For example:

```
 ├── /serendipity
     └── /frontend
         └── /projects
            └── /serendiptiy-pwa (app)
                └── /src
                    └── /app
                        └── /core
                            └── /error-handlers                        
                            └── /models
                            └── /services
                        └── /features
                            └── /home
                            └── /layout
                            └── /navigation-bar
                        └── /shared
                        ├── favicon.ico
                        ├── index.html
                    └── /assets
                        └── /data   
                        └── /images                                                                  
            └── /auth-lib (lib)                        
            └── /party-lib (lib)
            └── /work-lib (lib)
            └── /utils-lib (lib)
```

### NgModules

Angular 20 continues to support the use of NgModules, although it strongly encourages and promotes the adoption of 
**standalone components**, **directives**, and **pipes** as the preferred approach for new projects and for migrating existing ones.

While NgModules are still functional, the Angular team recommends transitioning to standalone wherever possible.

## ❯ Material Design

Material Design 3 is Google’s open-source design system for building beautiful, usable products.

### Foundations - Layout

For more information: [Layout](https://m3.material.io/foundations/layout/understanding-layout/overview)

### Styles - Color Roles

There are 26 standard color roles organised into six groups: primary, secondary, tertiary, error, surface, and outline.

- Surface: A role used for backgrounds and large, low-emphasis areas of the screen.
- Primary, Secondary, Tertiary: Accent color roles used to emphasize or de-emphasize foreground elements.
- Container: Roles used as a fill color for foreground elements like buttons. They should not be used for text or icons.
- On: Roles starting with this term indicate a color for text or icons on top of its paired parent color. For example, on primary is used for text and icons against the primary fill color.
- Variant: Roles ending with this term offer a lower emphasis alternative to its non-variant pair. For example, outline variant is a less emphasized version of the outline color.

Color roles are mapped to Material Components.

The most common combination of surface roles uses surface for a background area and surface container for a navigation area.

Text and icons typically use on surface and on surface variant on all types of surfaces.

For more information: [Color Roles](https://m3.material.io/styles/color/roles)

## ❯ Angular Material

Recent versions of Angular Material have adopted version 3 of the Material Design specification.

For more information: [Material Design 3](https://m3.material.io/)

### Install Angular Material

Add Angular Material to your application by running the following command:

```
ng add @angular/material
```

For more information: [Getting Started with Angular Material](https://material.angular.dev/guide/getting-started)

### Theming

Angular Material lets you customize the appearance of your components by defining a custom theme.

For more information: [Theming](https://material.angular.dev/guide/themingted)



#### System Variables

Angular Material components depend on system variables defined as CSS variables through the material.theme Sass mixin.

For more information: [System Variables](https://material.angular.dev/guide/system-variables)

### Material Icons

For more information: [Material Icons](https://developers.google.com/fonts/docs/material_icons)

## ❯ Features

### Home page

In Angular, the home page of an application is typically implemented as a dedicated component. This component serves as
the entry point and primary view for users when they first access the application or navigate to the root path.

```
ng generate component features/home --project serendipity-pwa
```

### Navigation Bar

A container for headers, titles, or actions.

```
ng generate component features/navigation-bar --project serendipity-pwa
```

**Note:** Due to changes in the Material Design specification (M2 -> M3) the `mat-toolbar` component no longer supports 
the predefined colour options e.g., <mat-toolbar color="primary">.

A simple workaround is to override the toolbar's background-color:

```
mat-toolbar {
  background-color: black !important;
}
```

### Sidenav

Angular Material provides two sets of components designed to add collapsible side content (often navigation, though it 
can be any content) alongside some primary content.

```
ng generate component features/sidenav --project serendipity-pwa
```

### Flex Layout

Angular 20, or any recent version of Angular, primarily encourages the use of native CSS Flexbox and CSS Grid for 
creating layouts, rather than relying on the previously popular `@angular/flex-layout` library. 
The `@angular/flex-layout` library has been deprecated and is no longer actively maintained by the Angular team.

### Angular CDK Layout: 

The Angular Component Dev Kit (CDK) provides the `@angular/cdk/layout` module, which offers utilities for responsive 
design, including breakpoint observers, that can be combined with native CSS Flexbox and Grid.

## ❯ References

### Angular

* Angular dev: [Angular CLI](https://angular.dev/cli)
* Angular dev: [Angular Style Guide](https://angular.dev/style-guide)
* Angular dev: [Multi-Project Workspace](https://angular.dev/reference/configs/file-structure#multiple-projects)
* Angular dev: [Multiple Project File Structure](https://angular.dev/reference/configs/file-structure#multiple-projects)

### Angular Material

* Material Angular dev: [Getting Started with Angular Material](https://material.angular.dev/guide/getting-started)
* GitHub: [Teradata Covalent](https://teradata.github.io/covalent/v11/#/)
